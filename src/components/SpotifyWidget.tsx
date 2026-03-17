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
          bottom: "32px", // Increased padding from the corner
          right: "32px",
          zIndex: 9999,
          padding: "16px 20px", // More generous padding
          borderRadius: "16px", // Cleaner, modern corner
          width: "fit-content",
          minWidth: "260px", // slightly wider base
          maxWidth: "360px",
          display: "flex",
          alignItems: "center",
          gap: "14px", // improved spacing
          backdropFilter: "blur(28px)", // deeper blur
          // Rich multi-stop gradients for depth
          background: isPlaying
            ? "linear-gradient(135deg, rgba(29, 185, 84, 0.25) 0%, rgba(10, 10, 10, 0.7) 40%, rgba(5, 5, 5, 0.9) 100%)"
            : "linear-gradient(135deg, rgba(50, 50, 50, 0.4) 0%, rgba(20, 20, 20, 0.7) 40%, rgba(5, 5, 5, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)", // subtle transparent border
          color: "#FAFAFA",
          // Enhanced, multi-layered "floating" box-shadow
          boxShadow: isPlaying
            ? "0 10px 40px -10px rgba(29, 185, 84, 0.3), 0 5px 20px -10px rgba(0, 0, 0, 0.2)"
            : "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 5px 20px -10px rgba(0, 0, 0, 0.2)",
          transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)", // smoother transition
          transform: hover ? "translateY(-6px) scale(1.02)" : "none", // stronger lift and subtle scale
          overflow: "hidden",
        }}
      >
        {/* ART / ICON CONTAINER */}
        <div style={{ flexShrink: 0 }}>
          {isPlaying ? (
            <img
              src={song.albumArt}
              width={48} // larger art
              height={48}
              alt="Art"
              style={{
                borderRadius: "10px", // subtle corner difference
                objectFit: "cover",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)", // separate shadow for art
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
                // Clean vector music note placeholder icon
                textShadow: "0 1px 1px rgba(0, 0, 0, 0.5)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 11.5V6H14.5V9H17V6V5.5C17 4.67 16.33 4 15.5 4H12H11.5C10.67 4
