import { useEffect, useState } from "react";
import ElasticSlider from "./ElasticSlider";

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
          paddingRight: isPlaying ? "56px" : "18px",

          borderRadius: "22px",
          width: hover ? "340px" : "280px",

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

          overflow: "hidden",
        }}
      >
        {/* TOP ROW */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {/* ICON / ALBUM */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {isPlaying ? (
              <img
                src={song.albumArt}
                width={52}
                height={52}
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
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

            {/* Glow */}
            {isPlaying && (
              <div
                style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "16px",
                  background: "rgba(29,185,84,0.3)",
                  filter: "blur(12px)",
                  animation: "pulse 2s infinite",
                }}
              />
            )}
          </div>

          {/* TEXT */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
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
                  No music playing
                </span>
              </>
            )}
          </div>

          {/* WAVEFORM */}
          {isPlaying && (
            <div style={{ display: "flex", gap: "3px", marginLeft: "auto" }}>
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

        {/* SLIDER */}
        {isPlaying && (
          <div style={{ marginTop: "4px" }}>
            <ElasticSlider
              defaultValue={50}
              startingValue={0}
              maxValue={100}
              className="w-full"
              leftIcon={<span style={{ fontSize: "12px" }}>🎵</span>}
              rightIcon={<span style={{ fontSize: "12px" }}>🔊</span>}
            />
          </div>
        )}

        {/* IDLE FOOTER */}
        {!isPlaying && (
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              opacity: 0.4,
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
        `}
        </style>
      </div>
    </a>
  );
}
