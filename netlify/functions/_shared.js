// Shared helpers for the Puck /edit auth + save functions. Kept dependency-free
// (no cookie-parsing library) since Node 18+ on Netlify ships a global fetch.

const STATE_COOKIE = "puck_oauth_state"
const TOKEN_COOKIE = "puck_gh_token"

function parseCookies(header) {
  const out = {}
  if (!header) return out
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=")
    if (idx === -1) return
    const key = pair.slice(0, idx).trim()
    const value = pair.slice(idx + 1).trim()
    if (key) out[key] = decodeURIComponent(value)
  })
  return out
}

function serializeCookie(name, value, { maxAge, clear = false } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`]
  parts.push("Path=/")
  parts.push("HttpOnly")
  parts.push("Secure")
  parts.push("SameSite=Lax")
  if (clear) {
    parts.push("Max-Age=0")
  } else if (maxAge) {
    parts.push(`Max-Age=${maxAge}`)
  }
  return parts.join("; ")
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function siteUrl() {
  return requireEnv("SITE_URL").replace(/\/$/, "")
}

async function getGithubLogin(token) {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "jeldonmusic-puck-editor",
      Accept: "application/vnd.github+json",
    },
  })
  if (!res.ok) return null
  const body = await res.json()
  return body.login
}

function isAllowedLogin(login) {
  const allowlist = (process.env.ALLOWED_GITHUB_LOGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  if (allowlist.length === 0) return true
  return login ? allowlist.includes(login) : false
}

module.exports = {
  STATE_COOKIE,
  TOKEN_COOKIE,
  parseCookies,
  serializeCookie,
  requireEnv,
  siteUrl,
  getGithubLogin,
  isAllowedLogin,
}
