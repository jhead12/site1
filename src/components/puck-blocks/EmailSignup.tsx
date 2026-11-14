import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Container, Heading, Kicker, Section, Text } from "../ui"
import * as styles from "./blocks.css"

export type EmailSignupProps = {
  kicker?: string
  heading: string
  text?: string
  bullets: { text: string }[]
  buttonLabel: string
  successMessage: string
  groupId?: string
  source: string
  fallbackUrl?: string
  anchor?: string
}

type Status = "idle" | "sending" | "done" | "error"

function SignupForm({
  buttonLabel,
  successMessage,
  groupId,
  source,
  fallbackUrl,
}: Pick<EmailSignupProps, "buttonLabel" | "successMessage" | "groupId" | "source" | "fallbackUrl">) {
  const [status, setStatus] = React.useState<Status>("idle")
  const [error, setError] = React.useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          groupId,
          source,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "Something went wrong.")
      setStatus("done")
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <p className={styles.signupSuccess} role="status">
        {successMessage}
      </p>
    )
  }

  return (
    <form className={styles.signupForm} onSubmit={onSubmit}>
      <label className={styles.signupLabel}>
        <span>First name</span>
        <input name="name" type="text" autoComplete="given-name" className={styles.signupInput} />
      </label>
      <label className={styles.signupLabel}>
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={styles.signupInput}
        />
      </label>
      {/* Honeypot: hidden from people, filled in by bots */}
      <input
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.signupHoneypot}
      />
      <button type="submit" className={styles.signupButton} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : buttonLabel}
      </button>
      {status === "error" && (
        <p className={styles.signupError} role="alert">
          {error}
          {fallbackUrl && (
            <>
              {" "}
              <a href={fallbackUrl}>Or get it here.</a>
            </>
          )}
        </p>
      )}
    </form>
  )
}

export const EmailSignup: ComponentConfig<EmailSignupProps> = {
  label: "Email Signup",
  fields: {
    kicker: { type: "text", label: "Kicker" },
    heading: { type: "text", label: "Heading" },
    text: { type: "textarea", label: "Body text" },
    bullets: {
      type: "array",
      label: "What's included",
      arrayFields: { text: { type: "text", label: "Item" } },
      defaultItemProps: { text: "New item" },
      getItemSummary: (item) => item.text || "Item",
    },
    buttonLabel: { type: "text", label: "Button label" },
    successMessage: { type: "textarea", label: "Message after signup" },
    groupId: {
      type: "text",
      label: "MailerLite group ID (blank = site default)",
    },
    source: { type: "text", label: "Source tag (for tracking, e.g. home-hero)" },
    fallbackUrl: { type: "text", label: "Fallback link if signup fails" },
    anchor: { type: "text", label: "Anchor ID (link to it with #id)" },
  },
  defaultProps: {
    kicker: "Free download",
    heading: "Get the MPC Quickstart Kit",
    text: "",
    bullets: [],
    buttonLabel: "Send me the kit",
    successMessage: "You're in! Check your inbox for the download link.",
    groupId: "",
    source: "puck",
    fallbackUrl: "https://winning.jeldonmusic.com/mpc-quickstart-kit/",
    anchor: "quickstart-kit",
  },
  render: ({ kicker, heading, text, bullets, anchor, ...formProps }) => (
    <Section id={anchor || undefined}>
      <Container width="narrow">
        <div className={styles.signupCard}>
          <Heading>
            {kicker && <Kicker>{kicker}</Kicker>}
            {heading}
          </Heading>
          {text && <Text as="p">{text}</Text>}
          {bullets?.length > 0 && (
            <ul className={styles.signupBullets}>
              {bullets.map((b, i) => (
                <li key={i}>{b.text}</li>
              ))}
            </ul>
          )}
          <SignupForm {...formProps} />
        </div>
      </Container>
    </Section>
  ),
}
