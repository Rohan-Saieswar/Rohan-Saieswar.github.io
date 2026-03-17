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
          bottom: "24px",
          right: "24px",
          zIndex: 9999,

          display: "flex",
          alignItems: "center",
          gap: "12px",

          padding: "12px 16px",
          borderRadius: "16px",

          width: isPlaying
            ? hover ? "300px" : "240px"
            : "180px",

          backdropFilter: "blur(12px)",
          background: "rgba(20,20,20,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: isPlaying
            ? "0 0 20px rgba(29,185,84,0.25)"
            : "0 0 10px rgba(0,0,0,0.3)",

          color: "white",

          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* ICON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          {isPlaying ? (
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "2px",
                    height: "10px",
                    background: "#1db954",
                    borderRadius: "2px",
                    animation: `eq 1s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <span style={{ fontSize: "16px", color: "#aaa" }}>♪</span>
          )}
        </div>

        {/* TEXT */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {isPlaying ? (
            <>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "13px",
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
              <span style={{ fontWeight: 600, fontSize: "13px" }}>
                Not playing
              </span>
              <span style={{ fontSize: "11px", opacity: 0.5 }}>
                Spotify
              </span>
            </>
          )}
        </div>
      </div>

      {/* ANIMATION */}
      <style>
        {`
        @keyframes eq {
          0% { height: 4px; opacity: 0.5; }
          50% { height: 12px; opacity: 1; }
          100% { height: 4px; opacity: 0.5; }
        }
      `}
      </style>
    </a>
  );
}
