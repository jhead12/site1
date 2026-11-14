const { TOKEN_COOKIE, parseCookies, getGithubLogin, isAllowedLogin } = require("./_shared")

exports.handler = async (event) => {
  const cookies = parseCookies(event.headers.cookie)
  const token = cookies[TOKEN_COOKIE]

  if (!token) {
    return { statusCode: 200, body: JSON.stringify({ authenticated: false }) }
  }

  const login = await getGithubLogin(token)

  if (!login || !isAllowedLogin(login)) {
    return { statusCode: 200, body: JSON.stringify({ authenticated: false }) }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authenticated: true, login }),
  }
}
