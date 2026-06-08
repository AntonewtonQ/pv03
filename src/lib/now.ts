export interface NowContent {
  headline: string;
  summary: string;
  availability: string;
  focus: string;
  building: string;
  learning: string;
  location: string;
  projectName: string;
  projectLink: string;
  projectCover: string;
  updatedAt: string;
}

export const emptyNowContent: NowContent = {
  headline: "",
  summary: "",
  availability: "",
  focus: "",
  building: "",
  learning: "",
  location: "",
  projectName: "",
  projectLink: "",
  projectCover: "",
  updatedAt: "",
};

export const toNowContent = (data?: Partial<Record<keyof NowContent, unknown>>) => {
  return Object.fromEntries(
    Object.keys(emptyNowContent).map((key) => [
      key,
      data?.[key as keyof NowContent] == null
        ? ""
        : String(data[key as keyof NowContent]),
    ])
  ) as unknown as NowContent;
};
