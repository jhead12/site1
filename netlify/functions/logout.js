const { TOKEN_COOKIE, serializeCookie, siteUrl } = require("./_shared")

exports.handler = async () => {
  return {
    statusCode: 302,
    multiValueHeaders: {
      "Set-Cookie": [serializeCookie(TOKEN_COOKIE, "", { clear: true })],
    },
    headers: {
      Location: `${siteUrl()}/edit/`,
    },
    body: "",
  }
}
