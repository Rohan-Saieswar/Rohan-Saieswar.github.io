import { useEffect, useState, useRef } from "react";
import { FaSpotify, FaApple, FaMusic } from "react-icons/fa";
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
  provider: "spotify" | "apple" | "lastfm" | "music" | "unknown";
  app?: string;
}

const NOW_PLAYING_API_URL = import.meta.env.VITE_NOW_PLAYING_API_URL?.trim();

function detectLastFmProvider(trackUrl?: string): TrackData["provider"] {
  if (!trackUrl) {
    return "lastfm";
  }

  if (trackUrl.includes("spotify")) {
    return "spotify";
  }

  if (trackUrl.includes("music.apple.com") || trackUrl.includes("itunes.apple.com") || trackUrl.includes("apple.com")) {
    return "apple";
  }

  return "lastfm";
}

function normalizeProvider(value?: string): TrackData["provider"] {
  switch (value?.trim().toLowerCase()) {
    case "spotify":
      return "spotify";
    case "apple":
    case "applemusic":
    case "apple-music":
    case "apple music":
    case "itunes":
      return "apple";
    case "lastfm":
    case "last.fm":
      return "lastfm";
    case "music":
      return "music";
    default:
      return value ? "unknown" : "unknown";
  }
}

function getProviderLabel(provider: TrackData["provider"], app?: string) {
  if (typeof app === "string" && app.trim().length > 0) {
    return app.trim();
  }

  switch (provider) {
    case "apple":
      return "Apple Music";
    case "spotify":
      return "Spotify";
    case "lastfm":
      return "Last.fm";
    default:
      return "Music";
  }
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

  function syncTrackIdentity(title?: string, artist?: string) {
    const currentTrackId = `${title ?? ""}-${artist ?? ""}`;
    if (currentTrackId !== lastTrackId.current) {
      setArtLoaded(false);
      lastTrackId.current = currentTrackId;
    }
  }

  async function fetchFromNowPlayingApi() {
    if (!NOW_PLAYING_API_URL) {
      return null;
    }

    const res = await fetch(NOW_PLAYING_API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Now playing API returned ${res.status}`);
    }

    const data = await res.json();
    if (!data || typeof data !== "object") {
      return null;
    }

    const title = typeof data.title === "string" ? data.title : undefined;
    const artist = typeof data.artist === "string" ? data.artist : undefined;
    const album = typeof data.album === "string" ? data.album : undefined;
    const albumArt = typeof data.albumArt === "string" ? data.albumArt : undefined;
    const url = typeof data.url === "string" ? data.url : undefined;
    const app = typeof data.app === "string" ? data.app : undefined;

    return {
      isPlaying: Boolean(data.isPlaying),
      title,
      artist,
      album,
      albumArt,
      url,
      app,
      provider: normalizeProvider(typeof data.provider === "string" ? data.provider : undefined),
    } satisfies TrackData;
  }

  async function getNowPlaying() {
    try {
      if (NOW_PLAYING_API_URL) {
        const apiTrack = await fetchFromNowPlayingApi();
        if (apiTrack) {
          syncTrackIdentity(apiTrack.title, apiTrack.artist);
          setSong(apiTrack);
          return;
        }
      }

      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      const track = data?.recenttracks?.track?.[0];
      if (!track) {
        setSong({ isPlaying: false, provider: "lastfm" });
        return;
      }

      // Safety: If track has a date, it is definitely NOT playing (Last.fm ghost fix)
      const isPlaying = track["@attr"]?.nowplaying === "true" && !track.date;
      
      const title = track.name;
      const artist = track.artist?.["#text"];
      const album = track.album?.["#text"];
      let albumArt = track.image?.[3]?.["#text"] || track.image?.[2]?.["#text"] || "";
      const provider = detectLastFmProvider(track.url);

      syncTrackIdentity(title, artist);

      // Last.fm's default grey star placeholder hash
      const isDefaultPlaceholder = albumArt.includes("2a96cbd8b46e442fc41c2b86b821562f");

      // Fallback: If Last.fm gives us the grey star placeholder, fetch the REAL album art from iTunes!
      if (!albumArt || isDefaultPlaceholder) {
        try {
          const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(title + " " + artist)}&entity=song&limit=1`);
          const itunesData = await itunesRes.json();
          if (itunesData.results && itunesData.results.length > 0) {
            albumArt = itunesData.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
          }
        } catch (e) {
          console.error("iTunes fallback failed", e);
        }
      }

      setSong({
        isPlaying,
        title,
        artist,
        album,
        albumArt,
        url: track.url,
        provider,
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
  const provider = song?.provider || "unknown";
  const providerLabel = getProviderLabel(provider, song?.app);
  const ProviderIcon = provider === "apple" ? FaApple : provider === "spotify" ? FaSpotify : FaMusic;
  const isAppleProvider = provider === "apple";

  const cardClass = `${styles.npCard} ${isAppleProvider ? styles.npCardApple : styles.npCardSpotify}`;
  const dotClass = `${styles.npDot} ${isPlaying ? styles.npDotLive : ""} ${isAppleProvider ? styles.npDotApple : styles.npDotSpotify}`;

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
              <ProviderIcon className={styles.npProviderSvg} />
              <span className={styles.npProviderLabel}>
                {providerLabel}
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
