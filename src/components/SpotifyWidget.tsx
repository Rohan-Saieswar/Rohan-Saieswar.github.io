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

  if (!song || !song.isPlaying) {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#111",
      color: "white",
      padding: "10px",
      borderRadius: "12px",
      fontSize: "12px",
      opacity: 0.7
    }}>
      Not playing
    </div>
  );
}

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#111",
      color: "white",
      padding: "10px",
      borderRadius: "12px",
      display: "flex",
      gap: "10px",
      alignItems: "center",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)"
    }}>
      <img src={song.albumArt} width={50} style={{ borderRadius: "8px" }} />
      <div>
        <div style={{ fontWeight: "bold" }}>{song.title}</div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>{song.artist}</div>
      </div>
    </div>
  );
}
