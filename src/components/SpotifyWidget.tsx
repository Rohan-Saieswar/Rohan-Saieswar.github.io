import { useEffect, useState } from "react";

/* =========================
   SPOTIFY WIDGET - CLEAN APPLE GLASS
========================= */

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
      style={{
        textDecoration: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 9999,
          padding: "16px",
          borderRadius: "24px",
          width: "fit-content",
          minWidth: "260px",
          maxWidth: "340px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          
          // APPLE GLASSMORPHISM EFFECT
          background: "rgba(20, 20, 20, 0.4)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          
          color: "#FAFAFA",
          transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          transform: hover ? "translateY(-4px) scale(1.02)" : "none",
          overflow: "hidden",
        }}
      >
        {/* ARTWORK */}
        <div style={{ flexShrink: 0 }}>
          {isPlaying ? (
            <img
              src={song.albumArt}
              width={52}
              height={52}
              alt="Art"
              style={{
                borderRadius: "12px",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
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
                background: "rgba(255, 255, 255, 0.08)",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
          )}
        </div>

        {/* TEXT CONTENT */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "-0.3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isPlaying ? song.title : "Not Playing"}
          </span>
          <span
            style={{
              fontSize: "13px",
              opacity: 0.6,
              letterSpacing: "-0.1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isPlaying ? song.artist : "Spotify"}
          </span>
        </div>

        {/* iOS STYLE WAVEFORM */}
        {isPlaying && (
          <div style={{ display: "flex", gap: "2px", alignItems: "center", height: "16px", paddingLeft: "8px" }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "3px",
                  height: "100%",
                  background: "#fff",
                  borderRadius: "2px",
                  animation: `iosWave 1.2s infinite ease-in-out ${i * 0.15}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        )}

        <style>
          {`
          @keyframes iosWave {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
          }
        `}
        </style>
      </div>
    </a>
  );
}
