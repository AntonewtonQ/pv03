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
      projectId
    )}/databases/(default)/documents/${path}`
  );

  if (apiKey) {
    url.searchParams.set("key", apiKey);
  }

  return url;
};

const getText = (
  fields: Record<string, FirestoreValue> | undefined,
  key: string
) => {
  const value = fields?.[key];

  if (!value) {
    return "";
  }

  return String(
    value.stringValue ?? value.integerValue ?? value.doubleValue ?? ""
  );
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
    link: getText(document.fields, "link"),
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
    });

    if (!response.ok) {
      return null;
    }

    return parseProject((await response.json()) as FirestoreDocument);
  } catch {
    return null;
  }
};

export const getProjects = async () => {
  const url = getFirestoreUrl("projects");

  if (!url) {
    return [];
  }

  url.searchParams.set("pageSize", "100");

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as {
      documents?: FirestoreDocument[];
    };

    return (result.documents ?? [])
      .map(parseProject)
      .filter((project): project is PortfolioProject => project !== null);
  } catch {
    return [];
  }
};
