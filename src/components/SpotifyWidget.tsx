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

          padding: "16px",
          // Extra right padding for the waveform if playing
          paddingRight: isPlaying ? "20px" : "16px",

          borderRadius: "24px",

          // ✨ ADAPTIVE WIDTH LOGIC
          width: "fit-content", 
          // Removed minWidth/maxWidth to let content dictate size
          display: "flex",
          flexDirection: "column",
          gap: "12px",

          backdropFilter: "blur(18px)",
          background: isPlaying
            ? "linear-gradient(135deg, rgba(29,185,84,0.15), rgba(0,0,0,0.6))"
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.6))",

          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: isPlaying
            ? "0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(29,185,84,0.2)"
            : "0 10px 30px rgba(0,0,0,0.3)",

          color: "white",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
          transform: hover ? "scale(1.02) translateY(-4px)" : "scale(1)",
          overflow: "hidden",
        }}
      >
        {/* TOP SECTION */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* ALBUM ART */}
          <div style={{ flexShrink: 0 }}>
            {isPlaying ? (
              <img
                src={song.albumArt}
                width={52}
                height={52}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: 52, height: 52, borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.05)", color: "#aaa"
              }}>♪</div>
            )}
          </div>

          {/* TEXT CONTAINER - Grows with content */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            minWidth: "120px" // Minimum to keep it from looking squashed
          }}>
            {isPlaying ? (
              <>
                <span style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  whiteSpace: "nowrap", // Keeps it on one line; widget will widen
                  letterSpacing: "-0.01em"
                }}>
                  {song.title}
                </span>
                <span style={{
                  fontSize: "12px",
                  opacity: 0.7,
                  whiteSpace: "nowrap"
                }}>
                  {song.artist}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>Spotify Idle</span>
                <span style={{ fontSize: "11px", opacity: 0.5 }}>No music playing</span>
              </>
            )}
          </div>

          {/* WAVEFORM */}
          {isPlaying && (
            <div style={{ 
              display: "flex", 
              gap: "3px", 
              alignItems: "center",
              marginLeft: "10px" // Space between text and bars
            }}>
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

        {/* SLIDER - Width matches the parent automatically */}
        {isPlaying && (
          <div style={{ marginTop: "4px" }}>
            <ElasticSlider
              defaultValue={50}
              startingValue={0}
              maxValue={100}
              className="w-full"
              leftIcon={<span style={{ fontSize: "12px", opacity: 0.6 }}>🎵</span>}
              rightIcon={<span style={{ fontSize: "12px", opacity: 0.6 }}>🔊</span>}
            />
          </div>
        )}

        <style>
          {`
          @keyframes wave {
            0% { height: 6px; }
            50% { height: 16px; }
            100% { height: 6px; }
          }
        `}
        </style>
      </div>
    </a>
  );
}
