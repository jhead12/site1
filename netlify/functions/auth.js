const crypto = require("crypto")
const { STATE_COOKIE, serializeCookie, requireEnv } = require("./_shared")

// Full-page redirect flow (no popup / postMessage) — GitHub's own consent
// screen takes the user out of the tab regardless, and a popup adds a class
// of "opened in a new tab / incognito" failures that a same-tab redirect
// avoids entirely.
exports.handler = async () => {
  const state = crypto.randomBytes(24).toString("hex")
  const clientId = requireEnv("GITHUB_OAUTH_CLIENT_ID")
  const redirectUri = requireEnv("GITHUB_OAUTH_REDIRECT_URI")

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize")
  authorizeUrl.searchParams.set("client_id", clientId)
  authorizeUrl.searchParams.set("redirect_uri", redirectUri)
  authorizeUrl.searchParams.set("scope", "repo")
  authorizeUrl.searchParams.set("state", state)

  return {
    statusCode: 302,
    multiValueHeaders: {
      "Set-Cookie": [
        // 15 minutes — generous room for the GitHub consent screen, per the
        // "state cookie expired before login finished" failure mode.
        serializeCookie(STATE_COOKIE, state, { maxAge: 900 }),
      ],
    },
    headers: {
      Location: authorizeUrl.toString(),
    },
    body: "",
  }
}
