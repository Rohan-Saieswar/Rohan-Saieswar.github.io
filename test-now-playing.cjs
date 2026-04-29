const handler = async () => {
  const username = 'Rohan_Saieswar';
  const apiKey = 'c629c22b1469e49dcba4bccf66df6692';

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RohanPortfolio/1.0",
        "Accept": "application/json"
      }
    });
    const text = await res.text();
    const data = JSON.parse(text);
    const track = data?.recenttracks?.track?.[0];

    const isPlaying = track["@attr"]?.nowplaying === "true";

    return {
      statusCode: 200,
      body: JSON.stringify({
        isPlaying,
        title: track?.name,
        artist: track?.artist?.["#text"],
        albumArt: track?.image?.[2]?.["#text"] || "",
        url: track?.url,
        provider: "music"
      })
    };
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

handler().then(console.log);
