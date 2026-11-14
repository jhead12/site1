import * as React from "react"
import "@measured/puck/puck.css"
import { config } from "../lib/puck/config"

// Pages editable from /edit. "home" renders at "/" (src/pages/index.js);
// every other slug renders at /<slug>/ via src/templates/puck-page.tsx.
// To add a page: add it here, open /edit/?page=<slug>, publish.
const PAGES = [
  { slug: "home", label: "Homepage (/)" },
  { slug: "design-lab", label: "Design Lab (/design-lab/)" },
]
const SLUG_RE = /^[a-z0-9-]+$/

function getSlug(): string {
  const requested = new URLSearchParams(window.location.search).get("page") || "home"
  return SLUG_RE.test(requested) ? requested : "home"
}

function pagePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}/`
}

type AuthState =
  | { status: "checking" }
  | { status: "signed-out" }
  | { status: "signed-in"; login: string }

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; commitUrl?: string }
  | { status: "error"; message: string }

function EditPage() {
  const [SLUG] = React.useState(getSlug)
  const [auth, setAuth] = React.useState<AuthState>({ status: "checking" })
  const [data, setData] = React.useState<any | null>(null)
  const [save, setSave] = React.useState<SaveState>({ status: "idle" })
  const [PuckEditor, setPuckEditor] = React.useState<any>(null)

  React.useEffect(() => {
    // @measured/puck's editor pulls in browser-only bits (drag/drop, iframe
    // preview), so it's loaded dynamically after mount rather than imported
    // at module scope — keeps it out of the server-rendered bundle entirely.
    import("@measured/puck").then((mod) => setPuckEditor(() => mod.Puck))

    fetch("/.netlify/functions/whoami", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((body) =>
        setAuth(
          body.authenticated
            ? { status: "signed-in", login: body.login }
            : { status: "signed-out" }
        )
      )
      .catch(() => setAuth({ status: "signed-out" }))

    // cache: "no-store" so a just-published page isn't shadowed by a cached copy
    fetch(`/puck-content/${SLUG}.json`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("not found")
        return res.json()
      })
      .then(setData)
      .catch(() =>
        setData({ root: { props: { title: "Jeldon Music", description: "" } }, content: [] })
      )
  }, [SLUG])

  const handlePublish = async (nextData: any) => {
    setSave({ status: "saving" })
    try {
      const res = await fetch("/.netlify/functions/save-puck-page", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: SLUG, data: nextData }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Save failed (${res.status})`)
      }
      const body = await res.json()
      setSave({ status: "saved", commitUrl: body.commitUrl })
    } catch (error: any) {
      setSave({ status: "error", message: error.message || "Save failed" })
    }
  }

  if (auth.status === "checking" || data === null) {
    return <Shell>Loading editor…</Shell>
  }

  if (auth.status === "signed-out") {
    return (
      <Shell>
        <p>You need to log in with GitHub to edit this page.</p>
        <a
          href="/.netlify/functions/auth"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#00a4ff",
            color: "#000",
            borderRadius: "8px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Log in with GitHub
        </a>
      </Shell>
    )
  }

  if (!PuckEditor) {
    return <Shell>Loading editor…</Shell>
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100000 }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100001,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 16px",
          background: "#000",
          color: "#fcfefe",
          fontSize: "13px",
          fontFamily: "monospace",
        }}
      >
        <span>
          Editing{" "}
          <select
            aria-label="Page to edit"
            value={SLUG}
            onChange={(e) => {
              window.location.search = `?page=${e.target.value}`
            }}
            style={{ background: "#111", color: "#fcfefe", border: "1px solid #333" }}
          >
            {PAGES.some((p) => p.slug === SLUG) ? null : (
              <option value={SLUG}>{pagePath(SLUG)} (new)</option>
            )}
            {PAGES.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>{" "}
          as {auth.login} — publishing commits to GitHub; the live site updates
          after the Netlify build (~3–5 min).{" "}
          <a href={pagePath(SLUG)} target="_blank" rel="noreferrer" style={{ color: "#00a4ff" }}>
            View live
          </a>
        </span>
        <span>
          {save.status === "saving" && "Saving…"}
          {save.status === "saved" && "Saved ✓"}
          {save.status === "error" && `Error: ${save.message}`}
          {"  "}
          <a href="/.netlify/functions/logout" style={{ color: "#00a4ff" }}>
            Log out
          </a>
        </span>
      </div>
      <div style={{ position: "absolute", top: "28px", left: 0, right: 0, bottom: 0 }}>
        <PuckEditor config={config} data={data} onPublish={handlePublish} />
      </div>
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        background: "#000",
        color: "#fcfefe",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "24px",
      }}
    >
      {children}
    </div>
  )
}

export default function Edit() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Shell>Loading editor…</Shell>
  }

  return <EditPage />
}

export function Head() {
  return (
    <>
      <title>Edit — Jeldon Music</title>
      <meta name="robots" content="noindex, nofollow" />
    </>
  )
}
