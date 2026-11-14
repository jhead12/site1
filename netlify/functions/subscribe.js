// Adds an email to a MailerLite group (e.g. the MPC Quickstart Kit list).
// Runs server-side so the API key never reaches the browser and the page
// needs no third-party form script (keeps the CSP's form-action 'self').
//
// Env: MAILERLITE_API_KEY (required), MAILERLITE_GROUP_ID (default group).
// The MailerLite automation attached to the group delivers the lead magnet.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GROUP_ID_RE = /^[0-9]+$/

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" })
  }

  const apiKey = process.env.MAILERLITE_API_KEY
  const defaultGroup = process.env.MAILERLITE_GROUP_ID
  if (!apiKey) {
    return json(503, { error: "Signup is not configured yet." })
  }

  let body
  try {
    body = JSON.parse(event.body || "{}")
  } catch {
    return json(400, { error: "Invalid request." })
  }

  const email = String(body.email || "").trim().toLowerCase()
  const name = String(body.name || "").trim().slice(0, 100)
  const source = String(body.source || "").trim().slice(0, 100)
  // Honeypot: real users never fill the hidden "company" field.
  if (body.company) return json(200, { ok: true })

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json(400, { error: "Please enter a valid email address." })
  }

  // A block may target its own group; otherwise fall back to the default.
  const groupId = GROUP_ID_RE.test(String(body.groupId || ""))
    ? String(body.groupId)
    : defaultGroup

  const payload = {
    email,
    ...(name ? { fields: { name } } : {}),
    ...(groupId ? { groups: [groupId] } : {}),
  }

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`MailerLite error ${res.status} (source=${source}): ${errText}`)
      return json(502, { error: "Couldn't sign you up right now. Please try again." })
    }

    // Visible in Netlify > Functions > subscribe logs, for per-placement attribution
    console.log(`subscribe ok source=${source || "unknown"} group=${groupId || "none"}`)
    return json(200, { ok: true })
  } catch (error) {
    console.error("MailerLite request failed:", error)
    return json(502, { error: "Couldn't sign you up right now. Please try again." })
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }
}
