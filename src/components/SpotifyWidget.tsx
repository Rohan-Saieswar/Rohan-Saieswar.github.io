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
          width: hover ? "280px" : "220px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          backdropFilter: "blur(18px)",
          background: isPlaying
            ? "linear-gradient(135deg, rgba(29,185,84,0.15), rgba(0,0,0,0.6))"
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.6))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: isPlaying
            ? "0 0 40px rgba(29,185,84,0.35)"
            : "0 0 25px rgba(255,255,255,0.05)",
          color: "white",
          transition: "all 0.35s ease",
          transform: hover ? "scale(1.03)" : "scale(1)",
        }}
      >
        {/* TOP */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Album */}
          <div
            style={{
              position: "relative",
            }}
          >
            <img
              src={
                isPlaying
                  ? song.albumArt
                  : "https://cdn-icons-png.flaticon.com/512/727/727245.png"
              }
              width={hover ? 56 : 44}
              style={{
                borderRadius: "14px",
                transition: "all 0.3s ease",
              }}
            />

            {/* Glow pulse */}
            {isPlaying && (
              <div
                style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "18px",
                  background: "rgba(29,185,84,0.3)",
                  filter: "blur(12px)",
                  animation: "pulse 2s infinite",
                }}
              />
            )}
          </div>

          {/* TEXT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {isPlaying ? (
              <>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>
                  {song.title}
                </span>
                <span style={{ fontSize: "11px", opacity: 0.6 }}>
                  {song.artist}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>
                  Spotify Idle
                </span>
                <span style={{ fontSize: "11px", opacity: 0.5 }}>
                  Nothing playing right now
                </span>
              </>
            )}
          </div>

          {/* Waveform */}
          {isPlaying && (
            <div style={{ display: "flex", gap: "3px", marginLeft: "auto" }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "3px",
                    height: "12px",
                    background: "#1db954",
                    borderRadius: "2px",
                    animation: `wave 1s infinite ${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* PROGRESS */}
        {isPlaying && hover && (
          <div>
            <div
              style={{
                height: "4px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #1db954, #1ed760, #1db954)",
                  animation: "progress 3s linear infinite",
                }}
              />
            </div>
          </div>
        )}

        {/* IDLE BEAUTY */}
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

          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.9; }
            100% { opacity: 0.4; }
          }

          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
        </style>
      </div>
    </a>
  );
}
