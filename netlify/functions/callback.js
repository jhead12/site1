const {
  STATE_COOKIE,
  TOKEN_COOKIE,
  parseCookies,
  serializeCookie,
  requireEnv,
  siteUrl,
  withConfigErrors,
} = require("./_shared")

exports.handler = withConfigErrors(async (event) => {
  const cookies = parseCookies(event.headers.cookie)
  const { code, state } = event.queryStringParameters || {}

  if (!code || !state || !cookies[STATE_COOKIE] || state !== cookies[STATE_COOKIE]) {
    // Most common cause: the login took longer than the state cookie's
    // lifetime, or the GitHub redirect landed on a different host (www vs
    // apex, http vs https) than the one that set the cookie.
    return {
      statusCode: 400,
      body: "Login failed: invalid or expired login attempt. Go back to /edit/ and try again, making sure to stay on the same tab and the same domain throughout.",
    }
  }

  const clientId = requireEnv("GITHUB_OAUTH_CLIENT_ID")
  const clientSecret = requireEnv("GITHUB_OAUTH_CLIENT_SECRET")
  const redirectUri = requireEnv("GITHUB_OAUTH_REDIRECT_URI")

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  })

  const tokenBody = await tokenRes.json()

  if (!tokenBody.access_token) {
    return {
      statusCode: 400,
      body: `Login failed: ${tokenBody.error_description || "no access token returned"}`,
    }
  }

  return {
    statusCode: 302,
    multiValueHeaders: {
      "Set-Cookie": [
        serializeCookie(TOKEN_COOKIE, tokenBody.access_token, { maxAge: 8 * 60 * 60 }),
        serializeCookie(STATE_COOKIE, "", { clear: true }),
      ],
    },
    headers: {
      Location: `${siteUrl()}/edit/`,
    },
    body: "",
  }
})
