import { useEffect, useState } from "react";

/* =========================
   UNIVERSAL MUSIC WIDGET
   - Shows now playing or last played track from Last.fm
   - Provider detection not available via Last.fm API,
     so we show a generic music icon
========================= */

interface TrackData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  url?: string;
  provider?: string;
}

export default function SpotifyWidget() {
  const [song, setSong] = useState<TrackData | null>(null);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(true);

  async function getNowPlaying() {
    try {
      const res = await fetch("/.netlify/functions/now-playing");
      const data: TrackData = await res.json();
      setSong(data);
    } catch (err) {
      console.error("Music widget error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNowPlaying();
    const interval = setInterval(getNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPlaying = song?.isPlaying === true;
  // Show the widget as long as we have a title (even if not currently playing)
  const hasTrack = !!song?.title;

  const accentColor = isPlaying ? "#1db954" : "rgba(255,255,255,0.35)";

  return (
    <a
      href={hasTrack ? (song?.url || "#") : "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
      title={hasTrack ? (isPlaying ? `Now Playing: ${song?.title}` : `Last Played: ${song?.title}`) : "Music"}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 9999,
          padding: "14px 16px",
          borderRadius: "20px",
          width: "fit-content",
          minWidth: "230px",
          maxWidth: "340px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

          // Glassmorphism
          background: "rgba(20, 20, 20, 0.72)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: `1px solid ${isPlaying ? "rgba(29,185,84,0.3)" : "rgba(255,255,255,0.10)"}`,
          boxShadow: isPlaying
            ? "0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(29,185,84,0.1)"
            : "0 20px 40px -10px rgba(0,0,0,0.5)",

          color: "#FAFAFA",
          transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
          transform: hover ? "translateY(-4px) scale(1.02)" : "none",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* STATUS DOT (top-left absolute) */}
        {hasTrack && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: isPlaying ? "#1db954" : "rgba(255,255,255,0.2)",
              boxShadow: isPlaying ? "0 0 6px #1db954" : "none",
              animation: isPlaying ? "pulse 2s infinite" : "none",
            }}
          />
        )}

        {/* ARTWORK */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          {hasTrack && song?.albumArt ? (
            <>
              <img
                src={song.albumArt}
                width={48}
                height={48}
                alt={song.title}
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
                  transition: "all 0.4s ease",
                  filter: isPlaying ? "none" : "grayscale(60%) brightness(0.75)",
                  display: "block",
                }}
              />
              {/* Spinning center dot when playing */}
              {isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "14px",
                    height: "14px",
                    background: "rgba(15, 15, 15, 0.85)",
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    animation: "spin 3s linear infinite",
                  }}
                />
              )}
            </>
          ) : (
            /* Placeholder icon when no track */
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.07)",
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              {/* Music note SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}
        </div>

        {/* TEXT CONTENT */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minWidth: 0 }}>
          {/* Status label */}
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: "2px",
              opacity: loading ? 0.5 : 1,
              transition: "color 0.3s ease",
            }}
          >
            {loading ? "Loading..." : isPlaying ? "Now Playing" : hasTrack ? "Last Played" : "Music"}
          </span>

          {/* Track title */}
          <span
            style={{
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "-0.2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#fff",
              lineHeight: 1.3,
            }}
          >
            {hasTrack ? song?.title : loading ? "—" : "Not Playing"}
          </span>

          {/* Artist */}
          <span
            style={{
              fontSize: "12px",
              letterSpacing: "-0.1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "rgba(255,255,255,0.55)",
              marginTop: "1px",
              lineHeight: 1.3,
            }}
          >
            {hasTrack ? song?.artist : "—"}
          </span>
        </div>

        {/* WAVEFORM — only when actively playing */}
        {isPlaying && (
          <div
            style={{
              display: "flex",
              gap: "2.5px",
              alignItems: "center",
              height: "18px",
              flexShrink: 0,
              paddingLeft: "6px",
            }}
          >
            {[0, 0.2, 0.1, 0.3, 0.15].map((delay, i) => (
              <div
                key={i}
                style={{
                  width: "2.5px",
                  background: "#1db954",
                  borderRadius: "2px",
                  animation: `iosWave 1.1s infinite ease-in-out ${delay}s`,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        )}

        <style>{`
          @keyframes iosWave {
            0%, 100% { height: 3px; }
            50% { height: 18px; }
          }
          @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to   { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.5; transform: scale(0.85); }
          }
        `}</style>
      </div>
    </a>
  );
}
