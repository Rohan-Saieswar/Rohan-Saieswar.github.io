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
          flexDirection: "column",
          gap: "10px",
          padding: hover ? "16px" : "12px",
          borderRadius: "18px",
          background: "rgba(20,20,20,0.6)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: isPlaying
            ? "0 0 25px rgba(29,185,84,0.4)"
            : "0 0 20px rgba(0,0,0,0.4)",
          color: "white",
          minWidth: hover ? "260px" : "200px",
          transition: "all 0.3s ease",
          cursor: isPlaying ? "pointer" : "default",
        }}
      >
        {/* Top Row */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Album Art */}
          <img
            src={
              isPlaying
                ? song.albumArt
                : "https://cdn-icons-png.flaticon.com/512/727/727245.png"
            }
            width={hover ? 50 : 40}
            style={{
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
          />

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

          {/* Equalizer */}
          {isPlaying && (
            <div style={{ display: "flex", gap: "2px", marginLeft: "auto" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "3px",
                    height: "10px",
                    background: "#1db954",
                    animation: `eq 1s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar (only when playing & hovered) */}
        {isPlaying && hover && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                height: "3px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "30%", // static (Spotify API doesn’t give progress here)
                  height: "100%",
                  background: "#1db954",
                }}
              />
            </div>
          </div>
        )}

        {/* Keyframes */}
        <style>
          {`
            @keyframes eq {
              0% { height: 4px; }
              50% { height: 12px; }
              100% { height: 4px; }
            }
          `}
        </style>
      </div>
    </a>
  );
}
