import React, { useEffect, useState } from "react";

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

  const isPlaying = !!(song && song.isPlaying);

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
          padding: "12px 16px",
          borderRadius: "20px",
          width: "fit-content",
          minWidth: "220px",
          maxWidth: "320px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backdropFilter: "blur(20px)",
          background: isPlaying
            ? "linear-gradient(135deg, rgba(29,185,84,0.15), rgba(0,0,0,0.6))"
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.6))",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          boxShadow: isPlaying ? "0 8px 30px rgba(29,185,84,0.2)" : "0 8px 30px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          transform: hover ? "translateY(-4px)" : "none",
          overflow: "hidden",
        }}
      >
        {/* ART */}
        <div style={{ flexShrink: 0 }}>
          {isPlaying ? (
            <img
              src={song.albumArt}
              width={40}
              height={40}
              alt="Art"
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.1)", color: "#888"
            }}>♪</div>
          )}
        </div>

        {/* MARQUEE TEXT */}
        <div style={{ 
          flex: 1, 
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
        }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            animation: isPlaying && hover ? "marquee 10s linear infinite" : "none" 
          }}>
            <span style={{ fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap" }}>
              {isPlaying ? song.title : "Spotify Idle"}
            </span>
            <span style={{ fontSize: "11px", opacity: 0.6, whiteSpace: "nowrap" }}>
              {isPlaying ? song.artist : "No music playing"}
            </span>
          </div>
        </div>

        {/* WAVEFORM */}
        {isPlaying && (
          <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "12px" }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  height: "100%",
                  background: "#1db954",
                  borderRadius: "1px",
                  animation: `wave 1s infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes wave {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
          }
        `}
        </style>
      </div>
    </a>
  );
}
