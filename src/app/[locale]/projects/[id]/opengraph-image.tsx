import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getProject } from "@/lib/projects-server";

export const alt = "Project by Antonewton Quima";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const getSocialCover = async (coverUrl?: string) => {
  if (!coverUrl) {
    return null;
  }

  try {
    const response = await fetch(coverUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const source = Buffer.from(await response.arrayBuffer());
    const converted = await sharp(source)
      .resize(620, 562, { fit: "cover" })
      .jpeg({ quality: 86 })
      .toBuffer();

    return `data:image/jpeg;base64,${converted.toString("base64")}`;
  } catch {
    return null;
  }
};

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  const cover = await getSocialCover(project?.cover);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          width: "100%",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            borderRight: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px",
            width: "45%",
          }}
        >
          <div
            style={{
              color: "#6ee7b7",
              display: "flex",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          >
            Antonewton Quima / Project
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 55,
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: 24,
              }}
            >
              {project?.name || "Portfolio Project"}
            </div>
            <div
              style={{
                color: "#a1a1aa",
                fontSize: 22,
                lineHeight: 1.4,
              }}
            >
              {project?.description || "Digital product and web experience."}
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 20,
              justifyContent: "space-between",
            }}
          >
            <span>{project?.year || "Portfolio"}</span>
            <span style={{ color: "#6ee7b7" }}>antonewton.xyz</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: "34px",
            width: "55%",
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt=""
              style={{
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 8,
                height: "100%",
                objectFit: "cover",
                width: "100%",
              }}
            />
          ) : (
            <div
              style={{
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 8,
                color: "#6ee7b7",
                display: "flex",
                fontSize: 60,
                fontWeight: 800,
                height: "100%",
                justifyContent: "center",
                width: "100%",
              }}
            >
              aq
            </div>
          )}
        </div>
      </div>
    ),
    size
  );
}
