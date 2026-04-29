import { useEffect, useState } from "react";
import { FaSpotify, FaApple } from "react-icons/fa"; // Using react-icons to show both platforms

/* =========================
   UNIVERSAL MUSIC WIDGET
   - Shows now playing or last played track directly from Last.fm
   - Enhanced UI with progress bar and 10-bar beat-synced waveform
========================= */

interface TrackData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  url?: string;
}

export default function SpotifyWidget() {
  const [song, setSong] = useState<TrackData | null>(null);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(true);

  const LASTFM_USERNAME = "Rohan_Saieswar";
  const LASTFM_API_KEY = "c629c22b1469e49dcba4bccf66df6692";

  async function getNowPlaying() {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      const track = data?.recenttracks?.track?.[0];
      if (!track) {
        setSong({ isPlaying: false });
        return;
      }

      const isPlaying = track["@attr"]?.nowplaying === "true";

      setSong({
        isPlaying,
        title: track.name,
        artist: track.artist?.["#text"],
        albumArt: track.image?.[2]?.["#text"] || "",
        url: track.url,
      });

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
  const hasTrack = !!song?.title;

  const accentColor = isPlaying ? "#1db954" : "rgba(255,255,255,0.4)";

  // Random delays and durations for the equalizer
  const eqData = [
    { delay: 0.1, duration: 0.8 }, { delay: 0.3, duration: 0.6 },
    { delay: 0.5, duration: 1.0 }, { delay: 0.2, duration: 0.7 },
    { delay: 0.4, duration: 0.9 }, { delay: 0.1, duration: 0.6 },
    { delay: 0.6, duration: 1.1 }, { delay: 0.3, duration: 0.8 },
    { delay: 0.2, duration: 0.7 }, { delay: 0.5, duration: 0.9 },
  ];

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
          padding: "16px",
          borderRadius: "24px",
          width: "320px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

          // Premium Glassmorphism
          background: "rgba(18, 18, 18, 0.8)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          border: `1px solid ${isPlaying ? "rgba(29,185,84,0.3)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: isPlaying
            ? "0 24px 48px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(29,185,84,0.15), 0 0 20px rgba(29,185,84,0.1) inset"
            : "0 20px 40px -10px rgba(0,0,0,0.5)",

          color: "#FAFAFA",
          transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          transform: hover ? "translateY(-6px) scale(1.02)" : "none",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* GLOW EFFECT IN BACKGROUND */}
        {isPlaying && hover && (
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(29,185,84,0.15) 0%, transparent 70%)",
              zIndex: 0,
              pointerEvents: "none",
              animation: "rotateGlow 10s linear infinite",
            }}
          />
        )}

        {/* STATUS DOT (top-right absolute) */}
        {hasTrack && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: isPlaying ? "#1db954" : "rgba(255,255,255,0.2)",
              boxShadow: isPlaying ? "0 0 8px #1db954" : "none",
              animation: isPlaying ? "pulse 2s infinite" : "none",
              zIndex: 2,
            }}
          />
        )}

        {/* ARTWORK (SPINNING VINYL) */}
        <div style={{ flexShrink: 0, position: "relative", zIndex: 2 }}>
          {hasTrack && song?.albumArt ? (
            <div 
              style={{ 
                position: "relative", 
                width: 56, 
                height: 56,
                // Make it circular when playing to look like a record
                borderRadius: isPlaying ? "50%" : "12px",
                overflow: "hidden",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
                transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                animation: isPlaying ? "spin 4s linear infinite" : "none",
                transformOrigin: "center center",
              }}
            >
              <img
                src={song.albumArt}
                width={56}
                height={56}
                alt={song.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: isPlaying ? "none" : "grayscale(80%) brightness(0.6)",
                  display: "block",
                }}
              />
              {/* Spinning CD Center Hole when playing */}
              {isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "14px",
                    height: "14px",
                    background: "#111",
                    border: "2px solid rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 0 8px rgba(0,0,0,0.8)",
                    zIndex: 2,
                  }}
                />
              )}
            </div>
          ) : (
            /* Placeholder icon */
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.3)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}
        </div>

        {/* TEXT & PROGRESS CONTENT */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", zIndex: 2, justifyContent: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
            {/* Status label + Platform Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: accentColor,
                  opacity: loading ? 0.5 : 1,
                  transition: "color 0.3s ease",
                }}
              >
                {loading && !hasTrack ? "Loading..." : isPlaying ? "Now Playing" : hasTrack ? "Last Played" : "Music"}
              </span>
              
              {/* Show Universal Music Icons since Last.fm merges all providers */}
              {hasTrack && !loading && (
                <div style={{ display: "flex", gap: "4px", color: "rgba(255,255,255,0.4)" }}>
                  <FaSpotify size={10} color={isPlaying ? "#1db954" : "rgba(255,255,255,0.3)"} />
                  <FaApple size={10} color={isPlaying ? "#fa243c" : "rgba(255,255,255,0.3)"} />
                </div>
              )}
            </div>

            {/* WAVEFORM / EQUALIZER */}
            {isPlaying && (
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  alignItems: "flex-end",
                  height: "12px",
                  marginRight: "10px"
                }}
              >
                {eqData.map((data, i) => (
                  <div
                    key={i}
                    style={{
                      width: "2px",
                      background: "#1db954",
                      borderRadius: "1px",
                      animation: `equalizer ${data.duration}s infinite ease-in-out alternate ${data.delay}s`,
                      opacity: 0.9,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Track title */}
          <span
            style={{
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "-0.2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {hasTrack ? song?.title : loading ? "—" : "Not Playing"}
          </span>

          {/* Artist */}
          <span
            style={{
              fontSize: "13px",
              letterSpacing: "-0.1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "rgba(255,255,255,0.6)",
              marginTop: "2px",
              lineHeight: 1.2,
            }}
          >
            {hasTrack ? song?.artist : "—"}
          </span>

          {/* PROGRESS BAR */}
          {hasTrack && (
            <div 
              style={{ 
                marginTop: "8px", 
                width: "100%", 
                height: "3px", 
                background: "rgba(255,255,255,0.1)", 
                borderRadius: "2px", 
                overflow: "hidden",
                position: "relative"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  background: isPlaying ? "#1db954" : "rgba(255,255,255,0.3)",
                  borderRadius: "2px",
                  animation: isPlaying ? "progress 180s linear infinite" : "none",
                  width: isPlaying ? "100%" : "100%",
                  transformOrigin: "left",
                  transform: isPlaying ? "scaleX(0)" : "scaleX(1)", // Reset to 0 when playing, full when not
                }}
              />
              {/* Playhead dot */}
              {isPlaying && (
                <div 
                  style={{
                    position: "absolute",
                    top: "-1px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                    animation: "progressDot 180s linear infinite",
                  }}
                />
              )}
            </div>
          )}
        </div>

        <style>{`
          @keyframes equalizer {
            0% { height: 2px; }
            100% { height: 12px; }
          }
          @keyframes progress {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
          @keyframes progressDot {
            0% { left: 0%; }
            100% { left: 100%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.5; transform: scale(0.8); }
          }
          @keyframes rotateGlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </a>
  );
}
