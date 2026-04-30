import { useEffect, useState, useRef } from "react";
import { FaSpotify, FaApple } from "react-icons/fa";
import styles from "./NowPlaying.module.css";

/* =========================
   UNIVERSAL MUSIC WIDGET
   - Shows now playing or last played track directly from Last.fm
   - Uses iTunes API as a fallback when Last.fm misses album art
   - Polished UI with glassmorphism, skeletons, and equalizer
========================= */

interface TrackData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  url?: string;
  provider: "spotify" | "apple" | "lastfm";
}

export default function SpotifyWidget() {
  const [song, setSong] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [artLoaded, setArtLoaded] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>("rgba(29, 185, 84, 0.1)");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTrackId = useRef<string>("");

  const LASTFM_USERNAME = "Rohan_Saieswar";
  const LASTFM_API_KEY = "c629c22b1469e49dcba4bccf66df6692";

  async function getNowPlaying() {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      const track = data?.recenttracks?.track?.[0];
      if (!track) {
        setSong({ isPlaying: false, provider: "lastfm" });
        return;
      }

      // Check if song changed to reset artwork loading state
      const currentTrackId = `${track.name}-${track.artist?.["#text"]}`;
      if (currentTrackId !== lastTrackId.current) {
        setArtLoaded(false);
        lastTrackId.current = currentTrackId;
      }

      // Safety: If track has a date, it is definitely NOT playing (Last.fm ghost fix)
      const isPlaying = track["@attr"]?.nowplaying === "true" && !track.date;
      
      const title = track.name;
      const artist = track.artist?.["#text"];
      const album = track.album?.["#text"];
      let albumArt = track.image?.[3]?.["#text"] || track.image?.[2]?.["#text"] || "";
      let provider: "spotify" | "apple" | "lastfm" = "spotify";

      // Last.fm's default grey star placeholder hash
      const isDefaultPlaceholder = albumArt.includes("2a96cbd8b46e442fc41c2b86b821562f");

      // Fallback: If Last.fm gives us the grey star placeholder, fetch the REAL album art from iTunes!
      if (!albumArt || isDefaultPlaceholder) {
        try {
          const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(title + " " + artist)}&entity=song&limit=1`);
          const itunesData = await itunesRes.json();
          if (itunesData.results && itunesData.results.length > 0) {
            albumArt = itunesData.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
            provider = "apple";
          }
        } catch (e) {
          console.error("iTunes fallback failed", e);
        }
      }

      // Refined provider detection
      if (track.url?.includes("spotify")) {
        provider = "spotify";
      } else if (track.url?.includes("apple.com") || track.url?.includes("itunes")) {
        provider = "apple";
      } else if (albumArt.includes("mzstatic.com")) {
        // mzstatic.com is Apple Music/iTunes CDN
        provider = "apple";
      }
      
      // Heuristic: If it's playing on Apple Music, the track URL often doesn't contain 'spotify'
      // Most 3rd party scrobblers for Apple Music won't provide a Spotify URL.
      if (provider === "spotify" && !track.url?.includes("spotify")) {
        // If we have no proof it's Spotify, and it's playing, it might be Apple Music
        // But Spotify is the default in the CSS tokens. 
        // We'll trust the URL more.
      }

      setSong({
        isPlaying,
        title,
        artist,
        album,
        albumArt,
        url: track.url,
        provider
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

  // Colour extraction logic
  useEffect(() => {
    if (song?.albumArt && artLoaded && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = song.albumArt;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        setDominantColor(`rgba(${r}, ${g}, ${b}, 0.15)`);
      };
    }
  }, [song?.albumArt, artLoaded]);

  const isPlaying = song?.isPlaying === true;
  const hasTrack = !!song?.title;
  const provider = song?.provider || "spotify";

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
            <div className={styles.npProvider}>
              {provider === "apple" ? (
                <FaApple className={styles.npProviderSvg} />
              ) : (
                <FaSpotify className={styles.npProviderSvg} />
              )}
              <span className={styles.npProviderLabel}>
                {provider === "apple" ? "Apple Music" : "Spotify"}
              </span>
            </div>
            
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
                  {provider === "apple" ? <FaApple className={styles.npProviderSvg} /> : <FaSpotify className={styles.npProviderSvg} />}
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
                  <p className={styles.npAlbum}>{song?.album}</p>
                </>
              ) : (
                <h3 className={styles.npTitle}>Nothing playing</h3>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
