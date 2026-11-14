const {
  TOKEN_COOKIE,
  parseCookies,
  requireEnv,
  getGithubLogin,
  isAllowedLogin,
} = require("./_shared")

const SLUG_RE = /^[a-z0-9-]+$/

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) }
  }

  const cookies = parseCookies(event.headers.cookie)
  const token = cookies[TOKEN_COOKIE]
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: "Not logged in" }) }
  }

  const login = await getGithubLogin(token)
  if (!login || !isAllowedLogin(login)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) }
  }

  let payload
  try {
    payload = JSON.parse(event.body || "{}")
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) }
  }

  const { slug, data } = payload
  if (!slug || !SLUG_RE.test(slug)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid slug" }) }
  }
  if (!data || typeof data !== "object") {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing data" }) }
  }

  const owner = requireEnv("GITHUB_OWNER")
  const repo = requireEnv("GITHUB_REPO")
  const branch = process.env.GITHUB_BRANCH || "master"
  const filePath = `static/puck-content/${slug}.json`
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`

  const ghHeaders = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "jeldonmusic-puck-editor",
    Accept: "application/vnd.github+json",
  }

  // Look up the current file's sha (required by the Contents API to update
  // an existing file; omitted entirely when the file doesn't exist yet).
  let sha
  const existing = await fetch(`${apiUrl}?ref=${branch}`, { headers: ghHeaders })
  if (existing.ok) {
    const existingBody = await existing.json()
    sha = existingBody.sha
  } else if (existing.status !== 404) {
    const errBody = await existing.text()
    return {
      statusCode: 502,
      body: JSON.stringify({ error: `GitHub lookup failed: ${errBody}` }),
    }
  }

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64")

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...ghHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `chore(puck): update /${slug}/ via /edit`,
      content,
      branch,
      ...(sha ? { sha } : {}),
      committer: { name: login, email: `${login}@users.noreply.github.com` },
    }),
  })

  if (!putRes.ok) {
    const errBody = await putRes.text()
    return {
      statusCode: 502,
      body: JSON.stringify({ error: `GitHub commit failed: ${errBody}` }),
    }
  }

  const putBody = await putRes.json()

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commitUrl: putBody.commit && putBody.commit.html_url }),
  }
}
