import { useEffect, useState, useRef } from "react";
import { FaSpotify, FaApple, FaMusic } from "react-icons/fa";
import styles from "./NowPlaying.module.css";

/* =========================
   UNIVERSAL MUSIC WIDGET (REVIVED)
   - Prioritizes custom Android Bridge API
   - Falls back to Last.fm with smart heuristic
   - Supports Spotify and Apple Music themes
========================= */

interface TrackData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  url?: string;
  provider: "spotify" | "apple" | "lastfm" | "unknown";
  app?: string; // Specific app name from Android Bridge
}

export default function SpotifyWidget() {
  const [song, setSong] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [artLoaded, setArtLoaded] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>("rgba(29, 185, 84, 0.1)");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTrackId = useRef<string>("");

  const USERNAME = import.meta.env.VITE_LASTFM_USERNAME || "Rohan_Saieswar";
  const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || "c629c22b1469e49dcba4bccf66df6692";
  const NOW_PLAYING_API = import.meta.env.VITE_NOW_PLAYING_API_URL;

  async function getNowPlaying() {
    try {
      let apiTrack: TrackData | null = null;
      let lastfmTrack: TrackData | null = null;

      // 1. Fetch from Custom Android Bridge API (Primary Source for App Detection)
      if (NOW_PLAYING_API) {
        try {
          const apiRes = await fetch(NOW_PLAYING_API);
          const apiData = await apiRes.json();
          if (apiData && apiData.title) {
            apiTrack = {
              isPlaying: Boolean(apiData.isPlaying),
              title: apiData.title,
              artist: apiData.artist,
              album: apiData.album,
              albumArt: apiData.albumArt,
              url: apiData.url,
              app: apiData.app,
              provider: (apiData.provider?.toLowerCase() === "apple" || apiData.app?.toLowerCase().includes("apple")) ? "apple" : 
                        (apiData.provider?.toLowerCase() === "spotify" || apiData.app?.toLowerCase().includes("spotify")) ? "spotify" : "spotify"
            };
          }
        } catch (e) { console.warn("Custom API fetch failed", e); }
      }

      // 2. Fetch from Last.fm (Backup for Metadata/Art and Recent Tracks)
      try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1&extended=1`;
        const res = await fetch(url);
        const data = await res.json();
        const track = data?.recenttracks?.track?.[0];
        
        if (track) {
          const isPlaying = track["@attr"]?.nowplaying === "true" && !track.date;
          const title = track.name;
          const artist = typeof track.artist === 'string' ? track.artist : track.artist?.name || track.artist?.["#text"];
          const album = track.album?.["#text"];
          let albumArt = track.image?.[3]?.["#text"] || track.image?.[2]?.["#text"] || "";
          
          // Heuristic: Explicit Apple markers or if it's obviously from iTunes
          let provider: "spotify" | "apple" | "lastfm" = "spotify";
          
          // Check for loved track or other extended metadata if helpful
          // (extended=1 adds 'loved' field but we mainly want 'provider' clues)
          
          if (track.url?.includes("apple.com") || track.url?.includes("itunes") || albumArt.includes("mzstatic.com")) {
            provider = "apple";
          }

          // iTunes Fallback
          const isDefaultPlaceholder = albumArt.includes("2a96cbd8b46e442fc41c2b86b821562f") || !albumArt;
          if (isDefaultPlaceholder) {
            try {
              const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(title + " " + artist)}&entity=song&limit=1`);
              const itunesData = await itunesRes.json();
              if (itunesData.results?.[0]) {
                albumArt = itunesData.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
                provider = "apple";
              }
            } catch (e) { /* ignore */ }
          }

          lastfmTrack = { isPlaying, title, artist, album, albumArt, url: track.url, provider };
        }
      } catch (e) { console.warn("Last.fm fetch failed", e); }

      // 3. Merge Logic: Prioritize API for "What app", Last.fm for "What song"
      if (apiTrack?.isPlaying) {
        // If API is live, use it primarily but fill missing art from Last.fm if available
        if (!apiTrack.albumArt && lastfmTrack && apiTrack.title === lastfmTrack.title) {
          apiTrack.albumArt = lastfmTrack.albumArt;
        }
        updateSongState(apiTrack);
      } else if (lastfmTrack) {
        // If API is idle but Last.fm has a track, use Last.fm but keep API's provider hint
        if (apiTrack && (apiTrack.title === lastfmTrack.title || !apiTrack.isPlaying)) {
          lastfmTrack.provider = apiTrack.provider;
          if (apiTrack.app) lastfmTrack.app = apiTrack.app;
        }
        updateSongState(lastfmTrack);
      } else {
        setSong({ isPlaying: false, provider: "spotify" });
      }

    } catch (err) {
      console.error("Music widget error:", err);
    } finally {
      setLoading(false);
    }
  }

  function updateSongState(newData: TrackData) {
    const trackId = `${newData.title}-${newData.artist}`;
    if (trackId !== lastTrackId.current) {
      setArtLoaded(false);
      lastTrackId.current = trackId;
    }
    setSong(newData);
  }

  useEffect(() => {
    getNowPlaying();
    const interval = setInterval(getNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (song?.albumArt && artLoaded && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = song.albumArt;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        setDominantColor(`rgba(${r}, ${g}, ${b}, 0.18)`);
      };
    }
  }, [song?.albumArt, artLoaded]);

  const isPlaying = song?.isPlaying === true;
  const hasTrack = !!song?.title;
  const provider = song?.provider || "unknown";
  const ProviderIcon = provider === "apple" ? FaApple : provider === "spotify" ? FaSpotify : FaMusic;

  const cardClass = `${styles.npCard} ${provider === "apple" ? styles.npCardApple : styles.npCardSpotify}`;
  const dotClass = `${styles.npDot} ${isPlaying ? styles.npDotLive : ""} ${provider === "apple" ? styles.npDotApple : styles.npDotSpotify}`;

  return (
    <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 9999 }}>
      <canvas ref={canvasRef} width={1} height={1} className={styles.npCanvas} />
      
      <a
        href={hasTrack ? (song?.url || "#") : "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        <div className={styles.npWash} style={{ background: isPlaying ? dominantColor : "transparent" }} />
        <div className={styles.npBorderShimmer} />
        
        <div className={styles.npInner}>
          <div className={styles.npHeader}>
            <div className={styles.npStatus}>
              <div className={dotClass} />
              <span className={styles.npStatusLabel}>
                {loading ? "FETCHING..." : isPlaying ? "NOW PLAYING" : "LAST PLAYED"}
              </span>
            </div>
          </div>

          <div className={styles.npTrackRow}>
            <div className={styles.npArtWrap}>
              {!artLoaded && <div className={styles.npArtSkeleton} />}
              {hasTrack && song?.albumArt ? (
                <>
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className={`${styles.npArt} ${artLoaded ? styles.npArtLoaded : ""}`}
                    onLoad={() => setArtLoaded(true)}
                  />
                  {isPlaying && (
                    <div className={`${styles.npBars} ${styles.npBarsActive}`}>
                      <div className={`${styles.npBar} ${styles.npBar1}`} />
                      <div className={`${styles.npBar} ${styles.npBar2}`} />
                      <div className={`${styles.npBar} ${styles.npBar3}`} />
                      <div className={`${styles.npBar} ${styles.npBar4}`} />
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.npArtEmpty}>
                  <ProviderIcon className={styles.npProviderSvg} />
                </div>
              )}
            </div>

            <div className={styles.npInfo}>
              {loading ? (
                <>
                  <div className={`${styles.npSkeleton} ${styles.npSkeletonTitle}`} />
                  <div className={`${styles.npSkeleton} ${styles.npSkeletonArtist}`} />
                  <div className={`${styles.npSkeleton} ${styles.npSkeletonAlbum}`} />
                </>
              ) : hasTrack ? (
                <>
                  <h3 className={styles.npTitle}>{song?.title}</h3>
                  <p className={styles.npArtist}>{song?.artist}</p>
                  <p className={styles.npAlbum}>{song?.album || "Unknown Album"}</p>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 className={styles.npTitle}>Nothing playing</h3>
                  <p className={styles.npArtist}>Silence is golden...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
