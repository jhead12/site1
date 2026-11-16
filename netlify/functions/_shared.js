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
  const raw = requireEnv("SITE_URL").trim().replace(/\/$/, "")
  // Tolerate "jeldonmusic.com" without a scheme — a bare host would
  // otherwise produce a relative Location header and a broken redirect.
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`
}

// GITHUB_REPO is the repo name ("site1"), but accept "owner/site1" too.
function githubRepo() {
  return requireEnv("GITHUB_REPO").trim().split("/").pop()
}

// Wrap a handler so a missing env var returns a readable 500 naming the
// variable, instead of an uncaught throw (which Netlify/Cloudflare surface
// as an opaque 502 Bad Gateway).
function withConfigErrors(handler) {
  return async (event, context) => {
    try {
      return await handler(event, context)
    } catch (error) {
      console.error(error)
      const isConfig = /Missing required environment variable/.test(error.message)
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: isConfig
          ? `Editor login is not configured: ${error.message}. Set it in Netlify > Site configuration > Environment variables, then redeploy.`
          : "Something went wrong. Check the Netlify function logs.",
      }
    }
  }
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
  githubRepo,
  withConfigErrors,
  getGithubLogin,
  isAllowedLogin,
}
