import { useEffect, useState } from "react";

export default function SpotifyWidget() {
  const [song, setSong] = useState<any>(null);
  const [hover, setHover] = useState(false);

  async function getNowPlaying() {
    try {
      const res = await fetch("https://project-o0epg.vercel.app/api/now-playing");
      const data = await res.json();
      setSong(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getNowPlaying();
    const interval = setInterval(getNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPlaying = song && song.isPlaying;

  return (
    <a
      href={isPlaying ? song.songUrl : "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,

          padding: hover ? "18px" : "14px",

          borderRadius: "22px",

          minWidth: "220px",
          maxWidth: "360px", // 🔥 allows growth for long titles
          width: "fit-content", // 🔥 dynamic sizing

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

          backdropFilter: "blur(18px)",
          background: isPlaying
            ? "linear-gradient(135deg, rgba(29,185,84,0.15), rgba(0,0,0,0.6))"
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.6))",

          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: isPlaying
            ? "0 0 40px rgba(29,185,84,0.35)"
            : "0 0 25px rgba(255,255,255,0.05)",

          color: "white",

          transition: "all 0.3s ease",
          transform: hover ? "scale(1.03)" : "scale(1)",

          overflow: "hidden",
        }}
      >
        {/* ROW */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minHeight: "48px",
          }}
        >
          {/* ICON */}
          <div style={{ flexShrink: 0, position: "relative" }}>
            {isPlaying ? (
              <img
                src={song.albumArt}
                width={48}
                height={48}
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.05)",
                  color: "#aaa",
                  fontSize: "18px",
                }}
              >
                ♪
              </div>
            )}
          </div>

          {/* TEXT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
              maxWidth: "220px", // 🔥 prevents collision
            }}
          >
            {isPlaying ? (
              <>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {song.title}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    opacity: 0.6,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {song.artist}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>
                  Spotify Idle
                </span>
                <span style={{ fontSize: "11px", opacity: 0.5 }}>
                  waiting for your next vibe...
                </span>
              </>
            )}
          </div>

          {/* WAVEFORM (inline but safe) */}
          {isPlaying && (
            <div
              style={{
                display: "flex",
                gap: "3px",
                marginLeft: "8px", // 🔥 spacing buffer
                flexShrink: 0,
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "3px",
                    height: "12px",
                    background: "#1db954",
                    borderRadius: "2px",
                    animation: `wave 1s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* IDLE FOOTER */}
        {!isPlaying && (
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              opacity: 0.4,
              marginTop: "4px",
            }}
          >
            🎧 waiting for your next vibe...
          </div>
        )}

        {/* ANIMATIONS */}
        <style>
          {`
          @keyframes wave {
            0% { height: 4px; }
            50% { height: 14px; }
            100% { height: 4px; }
          }
        `}
        </style>
      </div>
    </a>
  );
}
