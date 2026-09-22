import { cache } from "react";
import { normalizeRsvImageUrl } from "./image-urls";

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const getFirestoreUrl = (path: string) => {
  if (!projectId) {
    return null;
  }

  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      projectId,
    )}/databases/(default)/documents/${path}`,
  );

  if (apiKey) {
    url.searchParams.set("key", apiKey);
  }

  return url;
};

const getText = (
  fields: Record<string, FirestoreValue> | undefined,
  key: string,
) => {
  const value = fields?.[key];

  if (!value) {
    return "";
  }

  return String(
    value.stringValue ?? value.integerValue ?? value.doubleValue ?? "",
  );
};

const safePublicLink = (value: string) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

const parseProject = (document: FirestoreDocument): PortfolioProject | null => {
  const id = document.name?.split("/").pop();

  if (!id) {
    return null;
  }

  return {
    id,
    name: getText(document.fields, "name"),
    description: getText(document.fields, "description"),
    year: getText(document.fields, "year"),
    cover: normalizeRsvImageUrl(getText(document.fields, "cover")),
    link: safePublicLink(getText(document.fields, "link")),
  };
};

export const getProject = async (id: string) => {
  const url = getFirestoreUrl(`projects/${encodeURIComponent(id)}`);

  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return null;
    }

    return parseProject((await response.json()) as FirestoreDocument);
  } catch {
    return null;
  }
};

export const getProjectsResult = cache(
  async (): Promise<{ projects: PortfolioProject[]; error: boolean }> => {
    const url = getFirestoreUrl("projects");
    if (!url) return { projects: [], error: true };
    url.searchParams.set("pageSize", "100");
    try {
      const projects: PortfolioProject[] = [];
      do {
        const response = await fetch(url, {
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw new Error("Project source unavailable");
        const result = (await response.json()) as {
          documents?: FirestoreDocument[];
          nextPageToken?: string;
        };
        projects.push(
          ...(result.documents ?? [])
            .map(parseProject)
            .filter((project): project is PortfolioProject => project !== null),
        );
        if (!result.nextPageToken) break;
        url.searchParams.set("pageToken", result.nextPageToken);
      } while (true);
      return {
        projects: projects.sort(
          (a, b) =>
            b.year.localeCompare(a.year) || a.name.localeCompare(b.name),
        ),
        error: false,
      };
    } catch {
      return { projects: [], error: true };
    }
  },
);

export const getProjects = async () => (await getProjectsResult()).projects;
