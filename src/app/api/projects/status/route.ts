import type {
  ProjectAvailability,
  ProjectStatusResult,
} from "@/lib/project-status-types";
import { getProjects, type PortfolioProject } from "@/lib/projects-server";
import { assertPublicUrl } from "@/lib/public-url-server";

export const runtime = "nodejs";

const CHECK_TIMEOUT = 6000;
const SLOW_RESPONSE_TIME = 3000;
const CACHE_DURATION = 5 * 60 * 1000;
const MAX_REDIRECTS = 5;
const CONCURRENCY = 10;
const statusCache = new Map<
  string,
  { expiresAt: number; result: ProjectStatusResult }
>();

const responseHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

const createResult = (
  id: string,
  status: ProjectAvailability,
  responseTime: number | null,
  statusCode: number | null
): ProjectStatusResult => ({
  id,
  status,
  responseTime,
  statusCode,
  checkedAt: new Date().toISOString(),
});

const requestWithSafeRedirects = async (initialUrl: string) => {
  let currentUrl = await assertPublicUrl(initialUrl);
  const signal = AbortSignal.timeout(CHECK_TIMEOUT);

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const requestOptions: RequestInit = {
      method: "HEAD",
      redirect: "manual",
      signal,
      headers: {
        "User-Agent": "Antonewton-Portfolio-Status/1.0",
      },
      cache: "no-store",
    };
    let response = await fetch(currentUrl, requestOptions);

    if (response.status === 405 || response.status === 501) {
      response = await fetch(currentUrl, {
        ...requestOptions,
        method: "GET",
        headers: {
          ...requestOptions.headers,
          Range: "bytes=0-0",
        },
      });
    }

    if (response.status < 300 || response.status >= 400) {
      return response;
    }

    const location = response.headers.get("location");

    if (!location) {
      return response;
    }

    currentUrl = await assertPublicUrl(new URL(location, currentUrl).toString());
  }

  throw new Error("too-many-redirects");
};

const checkProject = async (project: PortfolioProject) => {
  if (!project.link.trim()) {
    return createResult(project.id, "unavailable", null, null);
  }

  const cacheKey = `${project.id}:${project.link}`;
  const cached = statusCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const startedAt = Date.now();
  let result: ProjectStatusResult;

  try {
    const response = await requestWithSafeRedirects(project.link);
    const responseTime = Date.now() - startedAt;
    const status =
      response.status >= 200 &&
      response.status < 400 &&
      responseTime < SLOW_RESPONSE_TIME
        ? "online"
        : "degraded";

    result = createResult(project.id, status, responseTime, response.status);
  } catch {
    result = createResult(
      project.id,
      "offline",
      Date.now() - startedAt,
      null
    );
  }

  statusCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_DURATION,
    result,
  });

  return result;
};

const checkProjects = async (projects: PortfolioProject[]) => {
  const results: ProjectStatusResult[] = [];

  for (let index = 0; index < projects.length; index += CONCURRENCY) {
    const batch = projects.slice(index, index + CONCURRENCY);
    results.push(...(await Promise.all(batch.map(checkProject))));
  }

  return results;
};

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const projects = await getProjects();
  const selectedProjects = (id
    ? projects.filter((project) => project.id === id)
    : projects
  ).slice(0, 50);

  if (id && selectedProjects.length === 0) {
    return Response.json({ error: "project-not-found" }, { status: 404 });
  }

  const statuses = await checkProjects(selectedProjects);

  return Response.json(
    { statuses },
    {
      headers:
        selectedProjects.length > 0
          ? responseHeaders
          : { "Cache-Control": "no-store" },
    }
  );
}
