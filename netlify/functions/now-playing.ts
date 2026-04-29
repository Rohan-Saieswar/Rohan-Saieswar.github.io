export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      apiKey: process.env.LASTFM_API_KEY || null,
      username: process.env.LASTFM_USERNAME || null
    })
  }
}
