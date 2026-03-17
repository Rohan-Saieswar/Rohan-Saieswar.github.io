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

  const isPlaying = !!(song && song.isPlaying);

  return (
    <a
      href={isPlaying ? song.songUrl : "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
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
          padding: "16px 20px",
          borderRadius: "16px",
          width: "fit-content",
          minWidth: "260px",
          maxWidth: "360px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          backdropFilter: "blur(28px)",
          background: isPlaying
            ? "linear-gradient(135deg, rgba(29, 185, 84, 0.25) 0%, rgba(10, 10, 10, 0.7) 40%, rgba(5, 5, 5, 0.9) 100%)"
            : "linear-gradient(135deg, rgba(50, 50, 50, 0.4) 0%, rgba(20, 20, 20, 0.7) 40%, rgba(5, 5, 5, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#FAFAFA",
          boxShadow: isPlaying
            ? "0 10px 40px -10px rgba(29, 185, 84, 0.3), 0 5px 20px -10px rgba(0, 0, 0, 0.2)"
            : "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 5px 20px -10px rgba(0, 0, 0, 0.2)",
          transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
          transform: hover ? "translateY(-6px) scale(1.02)" : "none",
          overflow: "hidden",
        }}
      >
        {/* ART / ICON CONTAINER */}
        <div style={{ flexShrink: 0 }}>
          {isPlaying ? (
            <img
              src={song.albumArt}
              width={48}
              height={48}
              alt="Art"
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
              }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#999",
                textShadow: "0 1px 1px rgba(0, 0, 0, 0.5)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 11.5V6H14.5V9H17V6V5.5C17 4.67 16.33 4 15.5 4H12H11.5C10.67 4 10 4.67 10 5.5V6H9.5C8.67 6 8 6.67 8 7.5V11H7.5C6.67 11 6 11.67 6 12.5C6 13.33 6.67 14 7.5 14H10H10.5C11.33 14 12 13.33 12 12.5V11.5Z" fill="#1DB954"/>
              </svg>
            </div>
          )}
        </div>

        {/* TEXT CONTENT & MARQUEE OPTIMIZATION */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              animation: isPlaying && hover ? "marquee 12s linear infinite" : "none",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "14px",
                whiteSpace: "nowrap",
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {isPlaying ? song.title : "Spotify Idle"}
            </span>
            <span
              style={{
                fontSize: "12px",
                opacity: 0.8,
                whiteSpace: "nowrap",
                letterSpacing: "-0.1px",
                textShadow: "0 1px 1px rgba(0,0,0,0.5)",
              }}
            >
              {isPlaying ? song.artist : "No music playing"}
            </span>
          </div>
        </div>

        {/* REFINED & EXPANDED WAVEFORM */}
        {isPlaying && (
          <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "16px", flexShrink: 0 }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  height: "100%",
                  background: "#1DB954",
                  borderRadius: "1px",
                  animation: `wave 1.2s infinite ease-in-out ${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* ANIMATION KEYFRAMES */}
        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes wave {
            0%, 100% { height: 5px; opacity: 0.7; }
            50% { height: 16px; opacity: 1; }
          }
        `}
        </style>
      </div>
    </a>
  );
}
