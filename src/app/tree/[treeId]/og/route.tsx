import { ImageResponse } from "next/og";
import { getTreeMetadata } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { treeId: string } }) {
  const tree = await getTreeMetadata(params.treeId);

  const surname = tree?.familySurname || "Family";
  const gotra = tree?.gotra || "";
  const village = tree?.village || "";
  const district = tree?.district || "";
  const members = tree?.totalMembers || 0;
  const generations = tree?.generations || 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #1A1207 0%, #2A1F0F 50%, #1A1207 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(201, 168, 76, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(45, 90, 30, 0.1)",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "32px 48px",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              display: "flex",
            }}
          >
            🌳
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#C9A84C",
              fontWeight: 600,
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            VANSH VRIKSH — वंश वृक्ष
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 48px",
            gap: "16px",
          }}
        >
          {/* Family name */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {surname} परिवार
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
            }}
          >
            {surname} Family Tree
          </div>

          {/* Details row */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "16px",
            }}
          >
            {gotra && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(201, 168, 76, 0.15)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                }}
              >
                <span style={{ fontSize: "20px", display: "flex" }}>🙏</span>
                <span style={{ fontSize: "22px", color: "#C9A84C", fontWeight: 600, display: "flex" }}>
                  {gotra} गोत्र
                </span>
              </div>
            )}
            {village && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                }}
              >
                <span style={{ fontSize: "20px", display: "flex" }}>📍</span>
                <span style={{ fontSize: "22px", color: "rgba(255,255,255,0.7)", display: "flex" }}>
                  {village}{district ? `, ${district}` : ""}
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px", display: "flex" }}>👥</span>
              <span style={{ fontSize: "22px", color: "rgba(255,255,255,0.5)", display: "flex" }}>
                {members} {members === 1 ? "Member" : "Members"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px", display: "flex" }}>📊</span>
              <span style={{ fontSize: "22px", color: "rgba(255,255,255,0.5)", display: "flex" }}>
                {generations} {generations === 1 ? "Generation" : "Generations"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 48px",
            borderTop: "1px solid rgba(201, 168, 76, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.3)",
              display: "flex",
            }}
          >
            Vansh-Vriksh.unfoldcro.in
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(45, 90, 30, 0.3)",
              borderRadius: "20px",
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#4ADE80", fontWeight: 600, display: "flex" }}>
              100% FREE SEVA — सेवा
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
