import { useEffect, useState } from "react";

export default function SpotifyWidget() {
  const [song, setSong] = useState<any>(null);

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
    <div
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
        background: "rgba(20, 20, 20, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        color: "white",
        minWidth: "180px",
        transition: "all 0.3s ease",
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: "20px", color: "#1db954" }}>
        ♪
      </div>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {isPlaying ? (
          <>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>
              {song.title}
            </span>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>
              {song.artist}
            </span>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>
              Not playing
            </span>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>
              Spotify
            </span>
          </>
        )}
      </div>
    </div>
  );
}
