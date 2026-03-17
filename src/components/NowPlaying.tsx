import { useEffect, useState } from "react";

export default function NowPlaying() {
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
    return <div>Nothing playing</div>;
  }

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <img src={song.albumArt} width={60} />
      <div>
        <div><b>{song.title}</b></div>
        <div>{song.artist}</div>
      </div>
    </div>
  );
}
