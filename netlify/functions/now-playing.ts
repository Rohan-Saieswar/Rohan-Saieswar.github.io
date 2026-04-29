export const handler = async () => {
  const username = process.env.LASTFM_USERNAME
  const apiKey = process.env.LASTFM_API_KEY

  if (!username || !apiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({ isPlaying: false })
    }
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RohanPortfolio/1.0",
        "Accept": "application/json"
      }
    })

    const text = await res.text()

    if (!text.startsWith("{")) {
      return {
        statusCode: 200,
        body: JSON.stringify({ isPlaying: false })
      }
    }

    const data = JSON.parse(text)
    const track = data?.recenttracks?.track?.[0]

    if (!track) {
      return {
        statusCode: 200,
        body: JSON.stringify({ isPlaying: false })
      }
    }

    const isPlaying =
      track["@attr"]?.nowplaying === "true" ||
      (Date.now() - parseInt(track?.date?.uts || "0") * 1000 < 180000)

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "public, max-age=5"
      },
      body: JSON.stringify({
        isPlaying,
        title: track.name,
        artist: track.artist["#text"],
        albumArt: track.image?.[2]?.["#text"] || "",
        provider: track.url?.includes("spotify") ? "spotify" : "apple"
      })
    }
  } catch {
    return {
      statusCode: 200,
      body: JSON.stringify({ isPlaying: false })
    }
  }
}
