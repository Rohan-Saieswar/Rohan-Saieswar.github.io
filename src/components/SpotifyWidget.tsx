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

          padding: isPlaying
            ? hover ? "18px" : "14px"
            : "12px",

          borderRadius: "22px",

          width: isPlaying
            ? hover ? "320px" : "260px"
            : hover ? "220px" : "160px",

          display: "flex",
          flexDirection: "column",
          gap: isPlaying ? "12px" : "6px",

          backdropFilter: "blur(18px)",

          background: isPlaying
            ? "linear-gradient(135deg, rgba(29,185,84,0.15), rgba(0,0,0,0.6))"
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.6))",

          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: isPlaying
            ? "0 0 40px rgba(29,185,84,0.35)"
            : "0 0 20px rgba(255,255,255,0.05)",

          color: "white",

          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",

          transform: hover
            ? "scale(1.05)"
            : isPlaying
              ? "scale(1.02)"
              : "scale(1)",

          overflow: "hidden",
          animation: isPlaying ? "fadeIn 0.4s ease" : "none",
        }}
      >
        {/* TOP ROW */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {/* 🎵 MUSIC ENERGY ICON */}
          <div style={{ position: "relative", width: 44, height: 44 }}>
            
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: isPlaying
                  ? "radial-gradient(circle, rgba(29,185,84,0.6), transparent)"
                  : "radial-gradient(circle, rgba(255,255,255,0.15), transparent)",
                filter: "blur(10px)",
                animation: "pulseGlow 2s infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: isPlaying ? "#1db954" : "#aaa",
                animation: "floatNote 3s ease-in-out infinite",
              }}
            >
              ♪
            </div>

            {isPlaying && (
              <>
                <div style={{
                  position: "absolute",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#1db954",
                  top: "10%",
                  left: "80%",
                  animation: "beat 1.2s infinite"
                }} />

                <div style={{
                  position: "absolute",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#1db954",
                  bottom: "15%",
                  left: "10%",
                  animation: "beat 1.2s infinite 0.4s"
                }} />
              </>
            )}
          </div>

          {/* TEXT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {isPlaying ? (
              <>
                <span style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "180px",
                }}>
                  {song.title}
                </span>
                <span style={{ fontSize: "11px", opacity: 0.6 }}>
                  {song.artist}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, fontSize: "13px" }}>
                  Spotify Idle
                </span>
                <span style={{ fontSize: "11px", opacity: 0.5 }}>
                  waiting for your next vibe...
                </span>
              </>
            )}
          </div>

          {/* WAVEFORM */}
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

        {/* ANIMATIONS */}
        <style>
          {`
          @keyframes wave {
            0% { height: 4px; }
            50% { height: 14px; }
            100% { height: 4px; }
          }

          @keyframes pulseGlow {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.2); }
            100% { opacity: 0.4; transform: scale(1); }
          }

          @keyframes floatNote {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }

          @keyframes beat {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }

          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0px) scale(1);
            }
          }
        `}
        </style>
      </div>
    </a>
  );
}
