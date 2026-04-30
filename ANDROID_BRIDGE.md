# Android Bridge

This project can now accept Android automation requests without requiring a JSON body.

## What works

- Android phone or tablet
- Spotify, Apple Music, YouTube Music, or any player that exposes track metadata
- MacroDroid, Automate, or Tasker HTTP requests
- Pano Scrobbler can keep doing normal scrobbling in parallel

## Important limitation

Pano Scrobbler does not directly send custom webhooks to your Vercel API.

Official references:

- Pano feature list: https://kawaiidango.github.io/pano-scrobbler/
- Pano FAQ says old Tasker intents were replaced with `ContentProvider` query URIs and an allowlist: https://kawaiidango.github.io/pano-scrobbler/faq.html

So the practical bridge is:

1. let Android automation detect the current song and app
2. send that metadata to `https://project-o0epg.vercel.app/api/now-playing`

## Simplest request format

Use `POST` to this URL:

```text
https://project-o0epg.vercel.app/api/now-playing
```

You can authenticate in any of these ways:

- `Authorization: Bearer <NOW_PLAYING_WRITE_TOKEN>`
- `X-Now-Playing-Token: <NOW_PLAYING_WRITE_TOKEN>`
- `?token=<NOW_PLAYING_WRITE_TOKEN>` in the URL

The endpoint accepts:

- JSON body
- `application/x-www-form-urlencoded`
- URL query parameters only

## Easiest Android URL template

If your automation app can only send a URL, use:

```text
https://project-o0epg.vercel.app/api/now-playing?token=YOUR_TOKEN&isPlaying=true&provider=spotify&app=Spotify&title=TRACK_TITLE&artist=TRACK_ARTIST&album=TRACK_ALBUM&durationMs=TRACK_DURATION_MS&progressMs=TRACK_POSITION_MS&source=android-bridge
```

Replace:

- `YOUR_TOKEN` with your `NOW_PLAYING_WRITE_TOKEN`
- `TRACK_TITLE` with the current song title variable
- `TRACK_ARTIST` with the current artist variable
- `TRACK_ALBUM` with the current album variable
- `TRACK_DURATION_MS` with the current duration variable
- `TRACK_POSITION_MS` with the current playback position variable

## Stop / pause template

When playback stops, send:

```text
https://project-o0epg.vercel.app/api/now-playing?token=YOUR_TOKEN&isPlaying=false&provider=spotify&app=Spotify&source=android-bridge
```

## MacroDroid idea

Create 2 macros:

### 1. Playing macro

Trigger:

- media / music changed, or
- notification from your player app when track changes

Action:

- HTTP request
- method: `POST`
- URL: use the template above with MacroDroid variables inserted

### 2. Stopped macro

Trigger:

- music playback stopped, or
- player notification removed

Action:

- HTTP request
- method: `POST`
- URL: use the stop template above

## Automate idea

Flow:

1. media metadata changed block
2. build URL with title / artist / album / app variables
3. HTTP request block to the now playing endpoint

Add a second path for playback stopped and send `isPlaying=false`.

## Provider values

Send one of these:

- `spotify`
- `apple`
- `music`
- `unknown`

If you also send `app`, the website will prefer that label directly.

Examples:

- `provider=spotify&app=Spotify`
- `provider=apple&app=Apple Music`
- `provider=music&app=YouTube Music`

## Test manually

```bash
curl -X POST "https://project-o0epg.vercel.app/api/now-playing?token=YOUR_TOKEN&isPlaying=true&provider=spotify&app=Spotify&title=Test%20Song&artist=Test%20Artist&source=android-bridge"
```

Then open:

```text
https://project-o0epg.vercel.app/api/now-playing
```
