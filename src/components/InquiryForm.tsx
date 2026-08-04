import * as React from "react"
import { Text } from "./ui"

export interface InquiryFormField {
  name: string
  label: string
  type: "text" | "email" | "textarea"
  required?: boolean
}

interface InquiryFormProps {
  formName: string
  fields: InquiryFormField[]
  submitLabel?: string
}

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&")
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "#fff",
  color: "#111",
  fontSize: "1rem",
}

/**
 * Submits to Netlify Forms (data-netlify + AJAX POST to "/"). No external
 * backend required — submissions appear in the Netlify dashboard under
 * Forms. Swap the submit handler for a real API call if/when a CRM or
 * automation backend is wired up.
 */
export default function InquiryForm({
  formName,
  fields,
  submitLabel = "Submit",
}: InquiryFormProps) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("submitting")
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": formName, ...values }),
      })
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`)
      setStatus("success")
    } catch (err) {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div style={{ padding: "1.5rem", borderRadius: "8px", background: "#e8f5e9" }}>
        <Text bold style={{ color: "#1b5e20" }}>
          Thanks — got it.
        </Text>
        <Text style={{ color: "#1b5e20" }}>I'll get back to you soon.</Text>
      </div>
    )
  }

  return (
    <form
      name={formName}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value={formName} />
      <p style={{ display: "none" }}>
        <label>
          Don&apos;t fill this out if you&apos;re human:
          <input name="bot-field" onChange={handleChange} />
        </label>
      </p>

      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor={field.name}
            style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}
          >
            {field.label}
            {field.required && " *"}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={5}
              onChange={handleChange}
              style={inputStyle}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              onChange={handleChange}
              style={inputStyle}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          padding: "0.75rem 1.75rem",
          borderRadius: "999px",
          border: "none",
          background: "#e50914",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: status === "submitting" ? "default" : "pointer",
          opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>

      {status === "error" && (
        <Text style={{ marginTop: "0.75rem", color: "#c62828" }}>
          Something went wrong — please try again or email{" "}
          <a href="mailto:info@jeldonmusic.com">info@jeldonmusic.com</a> directly.
        </Text>
      )}
    </form>
  )
}
