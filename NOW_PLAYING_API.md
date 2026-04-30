# Now Playing API

This project can read live music state from a Vercel Function instead of guessing from Last.fm.

## What it does

- `GET /api/now-playing` returns the latest stored track
- `POST /api/now-playing` updates the latest stored track
- the frontend reads `VITE_NOW_PLAYING_API_URL` first, then falls back to Last.fm only if that API is not configured
- `POST` accepts JSON, form-encoded data, or URL query parameters for easier Android automation

## Required server env vars

If you connected Redis through the Vercel Marketplace integration, you should already have:

- `REDIS_URL`

If you are using Upstash REST directly instead of `REDIS_URL`, the API also supports:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Add this manually in either case:

- `NOW_PLAYING_WRITE_TOKEN`

`NOW_PLAYING_WRITE_TOKEN` is the secret your local sender uses when posting track updates.

## Required frontend env var

Set this when building the site:

- `VITE_NOW_PLAYING_API_URL=https://your-vercel-project.vercel.app/api/now-playing`

If your site stays on GitHub Pages and the API lives on Vercel, this must be the full Vercel URL.

## Example POST

```bash
curl -X POST "https://your-vercel-project.vercel.app/api/now-playing" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NOW_PLAYING_WRITE_TOKEN" \
  -d '{
    "isPlaying": true,
    "provider": "spotify",
    "app": "Spotify",
    "title": "Song Name",
    "artist": "Artist Name",
    "album": "Album Name",
    "albumArt": "https://example.com/cover.jpg",
    "url": "https://open.spotify.com/track/123",
    "progressMs": 42000,
    "durationMs": 193000,
    "source": "local-player-script",
    "ttlSeconds": 180
  }'
```

## Example stop update

```bash
curl -X POST "https://your-vercel-project.vercel.app/api/now-playing" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NOW_PLAYING_WRITE_TOKEN" \
  -d '{
    "isPlaying": false,
    "provider": "spotify",
    "app": "Spotify",
    "ttlSeconds": 60
  }'
```

## URL-only example

Useful for MacroDroid, Automate or other simple mobile automation apps:

```text
https://your-vercel-project.vercel.app/api/now-playing?token=YOUR_TOKEN&isPlaying=true&provider=spotify&app=Spotify&title=Song%20Name&artist=Artist%20Name&source=android-bridge
```

## Notes

- send updates every 15 to 30 seconds while music is playing
- send `provider` as `spotify` or `apple` if your local sender knows the real app
- if the key expires, the API automatically returns `isPlaying: false`

## References

- Vercel Functions: https://vercel.com/docs/functions
- Vercel Storage overview: https://vercel.com/docs/storage
- Upstash REST API: https://upstash.com/docs/redis/features/restapi
- Android bridge guide in this repo: `ANDROID_BRIDGE.md`
