/**
 * Security validation utilities for form inputs
 */

// Sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (!input) return input

  // Replace potentially dangerous characters
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    // .trim()
}

// Validate input against common attack patterns
export function validateInput(input: string, type: "name" | "email" | "subject" | "message"): boolean {
  if (!input) return false

  // Check for common attack patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i,
    /vbscript:/i,
    /document\./i,
    /window\./i,
    /alert\(/i,
    /confirm\(/i,
    /prompt\(/i,
    /eval\(/i,
    /exec\(/i,
    /SELECT.*FROM/i,
    /INSERT.*INTO/i,
    /UPDATE.*SET/i,
    /DELETE.*FROM/i,
    /UNION.*SELECT/i,
    /DROP.*TABLE/i,
  ]

  // Check if input contains any suspicious patterns
  const hasSuspiciousPattern = suspiciousPatterns.some((pattern) => pattern.test(input))
  if (hasSuspiciousPattern) return false

  // Type-specific validation
  switch (type) {
    case "name":
      // Only allow letters, spaces, and common name characters
      return /^[a-zA-Z\s\-'.]{2,50}$/.test(input)

    case "email":
      // RFC 5322 compliant email regex
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        input,
      )

    case "subject":
      // Reasonable subject line with limited special characters
      return /^[a-zA-Z0-9\s\-_,.?!()]{3,100}$/.test(input)

    case "message":
      // More permissive for message content but still with limits
      return input.length >= 10 && input.length <= 1000

    default:
      return false
  }
}

// Check for common SQL injection patterns
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /'\s*OR\s*'1'\s*=\s*'1/i,
    /'\s*OR\s*1\s*=\s*1/i,
    /'\s*OR\s*'\w+'\s*=\s*'\w+/i,
    /'\s*OR\s*\d+\s*=\s*\d+/i,
    /'\s*;\s*DROP\s+TABLE/i,
    /'\s*;\s*DELETE\s+FROM/i,
    /'\s*UNION\s+SELECT/i,
    /'\s*INSERT\s+INTO/i,
    /'\s*UPDATE\s+.+\s+SET/i,
    /'\s*;\s*SELECT\s+.+\s+FROM/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

// Generate a secure random token (for CSRF protection)
export function generateSecurityToken(length = 32): string {
  if (typeof window !== "undefined" && window.crypto) {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(length)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  } else {
    // Fallback for environments without crypto
    let token = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return token
  }
}

// Validate a complete form submission
export function validateFormSubmission(formData: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {}

  // Check for honeypot (bot detection)
  if (formData.honeypot) {
    errors.general = "Bot submission detected"
    return errors
  }

  // Validate each field
  if (!validateInput(formData.name, "name")) {
    errors.name = "Invalid name format"
  }

  if (!validateInput(formData.email, "email")) {
    errors.email = "Invalid email format"
  }

  if (!validateInput(formData.subject, "subject")) {
    errors.subject = "Invalid subject format"
  }

  if (!validateInput(formData.message, "message")) {
    errors.message = "Invalid message format"
  }

  // Check for SQL injection in all fields
  for (const [field, value] of Object.entries(formData)) {
    if (field !== "honeypot" && containsSqlInjection(value)) {
      errors[field] = "Potentially malicious content detected"
      errors.general = "Security alert: Potentially malicious input detected"
      break
    }
  }

  return errors
}
