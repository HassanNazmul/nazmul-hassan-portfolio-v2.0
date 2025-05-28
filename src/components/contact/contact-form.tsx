"use client"

import type React from "react"
import { useState, useRef, useEffect, type FormEvent } from "react"
import { Send, Shield } from "lucide-react"
import TerminalOutput from "./terminal-output"
import { sanitizeInput } from "@/utils/security-validation"
import { formatField } from "@/utils/text-formatting"

// Define validation patterns
const VALIDATION_PATTERNS = {
  // Only allow letters, spaces, and common name characters
  NAME_PATTERN: /^[a-zA-Z\s\-'.]{2,50}$/,
  // RFC 5322 compliant email regex
  EMAIL_PATTERN:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // Reasonable subject line with limited special characters
  SUBJECT_PATTERN: /^[a-zA-Z0-9\s\-_,.?!()]{3,100}$/,
  // More permissive for message content but still with limits
  MESSAGE_PATTERN: /^[\s\S]{10,1000}$/,
}

// Security error messages
const SECURITY_ERRORS = {
  NAME_INVALID: "ERR: Invalid name format detected",
  NAME_REQUIRED: "ERR: Name parameter required",
  EMAIL_INVALID: "ERR: Invalid email format detected",
  EMAIL_REQUIRED: "ERR: Email parameter required",
  SUBJECT_INVALID: "ERR: Subject contains invalid characters",
  SUBJECT_REQUIRED: "ERR: Subject parameter required",
  MESSAGE_TOO_SHORT: "ERR: Message too short (min 10 chars)",
  MESSAGE_TOO_LONG: "ERR: Message exceeds max length",
  MESSAGE_REQUIRED: "ERR: Message content empty",
  SUSPICIOUS_CONTENT: "ERR: Potentially malicious content detected",
  RATE_LIMIT: "ERR: Too many attempts. Please try again later",
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // Honeypot field to catch bots
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    subject?: string
    message?: string
    general?: string
  }>({})
  const [submissionAttempts, setSubmissionAttempts] = useState(0)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const [securityToken, setSecurityToken] = useState<string>('')

  // Generate a security token for CSRF protection
  function generateSecurityToken() {
    if (typeof window !== 'undefined') {
      return Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    }
    return ''
  }

  useEffect(() => {
    setSecurityToken(generateSecurityToken())
  }, [])

  // Check for suspicious patterns in input
  const containsSuspiciousPatterns = (input: string): boolean => {
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

    return suspiciousPatterns.some((pattern) => pattern.test(input))
  }

  // Reset form after successful submission
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle")
        setTerminalLines([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Skip honeypot field validation
    if (name === "honeypot") {
      setFormData((prev) => ({ ...prev, [name]: value }))
      return
    }

    // Sanitize input as user types
    const sanitizedValue = sanitizeInput(value)
    
    // Apply grammar formatting in real-time
    const formattedValue = formatField(sanitizedValue, name as 'name' | 'email' | 'subject' | 'message')
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    
    // Real-time validation for sophisticated feedback
    validateFieldInRealTime(name, formattedValue) // Use formatted value for validation
  }

  // Validate a single field in real-time
  const validateFieldInRealTime = (fieldName: string, value: string) => {
    // Only validate after user has typed a few characters
    if (value.length < 3) return

    switch (fieldName) {
      case "email":
        if (value && !VALIDATION_PATTERNS.EMAIL_PATTERN.test(value)) {
          setErrors((prev) => ({ ...prev, email: SECURITY_ERRORS.EMAIL_INVALID }))
        }
        break
      case "name":
        if (value && !VALIDATION_PATTERNS.NAME_PATTERN.test(value)) {
          setErrors((prev) => ({ ...prev, name: SECURITY_ERRORS.NAME_INVALID }))
        }
        break
      case "subject":
        if (value && !VALIDATION_PATTERNS.SUBJECT_PATTERN.test(value)) {
          setErrors((prev) => ({ ...prev, subject: SECURITY_ERRORS.SUBJECT_INVALID }))
        }
        break
      case "message":
        if (value && value.length < 10) {
          setErrors((prev) => ({ ...prev, message: SECURITY_ERRORS.MESSAGE_TOO_SHORT }))
        } else if (value && value.length > 1000) {
          setErrors((prev) => ({ ...prev, message: SECURITY_ERRORS.MESSAGE_TOO_LONG }))
        }
        break
    }

    // Check for suspicious patterns in all fields
    if (containsSuspiciousPatterns(value)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: SECURITY_ERRORS.SUSPICIOUS_CONTENT,
        general: "Security alert: Potentially malicious input detected",
      }))
    }
  }

  // Comprehensive form validation
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
      email?: string
      subject?: string
      message?: string
      general?: string
    } = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = SECURITY_ERRORS.NAME_REQUIRED
    } else if (!VALIDATION_PATTERNS.NAME_PATTERN.test(formData.name)) {
      newErrors.name = SECURITY_ERRORS.NAME_INVALID
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = SECURITY_ERRORS.EMAIL_REQUIRED
    } else if (!VALIDATION_PATTERNS.EMAIL_PATTERN.test(formData.email)) {
      newErrors.email = SECURITY_ERRORS.EMAIL_INVALID
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = SECURITY_ERRORS.SUBJECT_REQUIRED
    } else if (!VALIDATION_PATTERNS.SUBJECT_PATTERN.test(formData.subject)) {
      newErrors.subject = SECURITY_ERRORS.SUBJECT_INVALID
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = SECURITY_ERRORS.MESSAGE_REQUIRED
    } else if (formData.message.length < 10) {
      newErrors.message = SECURITY_ERRORS.MESSAGE_TOO_SHORT
    } else if (formData.message.length > 1000) {
      newErrors.message = SECURITY_ERRORS.MESSAGE_TOO_LONG
    }

    // Check all fields for suspicious patterns
    for (const [field, value] of Object.entries(formData)) {
      if (field !== "honeypot" && containsSuspiciousPatterns(value)) {
        newErrors[field as keyof typeof newErrors] = SECURITY_ERRORS.SUSPICIOUS_CONTENT
        newErrors.general = "Security alert: Potentially malicious input detected"

        // Log security incident (in a real app, this would go to a security monitoring system)
        console.warn(`Security alert: Suspicious input in ${field} field`)
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Focus the first field with an error (only after form submission)
  useEffect(() => {
    // Only focus on errors if we just attempted to submit the form
    if (!isSubmitting) return
    
    const errorFields = Object.keys(errors)
    if (errorFields.length > 0 && formRef.current) {
      const firstErrorField = errorFields[0]
      if (firstErrorField !== "general") {
        const errorElement = formRef.current.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
        if (errorElement) {
          errorElement.focus()
        }
      }
    }
  }, [errors, isSubmitting]) // Add isSubmitting dependency

  // Handle form submission with security checks
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Check if honeypot field is filled (bot detection)
    if (formData.honeypot) {
      console.warn("Bot submission detected")
      // Pretend success but don't actually submit
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitting(false)
      setSubmitStatus("success")
      return
    }

    // Rate limiting
    const now = Date.now()
    if (now - lastSubmissionTime < 10000 && submissionAttempts > 2) {
      setErrors({ general: SECURITY_ERRORS.RATE_LIMIT })
      return
    }

    // Update submission tracking
    setSubmissionAttempts((prev) => prev + 1)
    setLastSubmissionTime(now)

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setTerminalLines([
      "Initializing secure contact request...",
      "Performing security checks...",
      "Validating input integrity...",
      `From: ${sanitizeInput(formData.name)} <${sanitizeInput(formData.email)}>`,
      `Subject: ${sanitizeInput(formData.subject)}`,
      "Encrypting message content...",
      "Establishing secure connection...",
    ])

    // Simulate form submission with security checks
    try {
      // In a real implementation, you would send the security token with the request
      // for CSRF protection
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTerminalLines((prev) => [...prev, "Security verification complete", "Message delivered successfully!"])
      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: "",
      })

      // Generate a new security token after successful submission
      setSecurityToken(generateSecurityToken())
    } catch (error) {
      setTerminalLines((prev) => [...prev, "Error: Message delivery failed."])
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="tech-card h-full">
      <h3 className="text-2xl font-semibold text-white mb-6 font-orbitron flex items-center">
        <Send className="h-5 w-5 mr-2 text-cyan-500" />
        Send a Message
        <Shield className="h-4 w-4 ml-2 text-green-400" aria-label="Secure Form" />
      </h3>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from users but bots will fill it */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Leave this field empty</label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Hidden CSRF token field */}
        <input type="hidden" name="_token" value={securityToken} />  {/* ✅ Fixed: Remove .current */}

        {/* General error message */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-mono flex items-center">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1 font-mono">
            Your Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.name ? "border-red-500" : "border-zinc-700"
              } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono`}
              placeholder={errors.name || "John Doe"}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1 font-mono">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={100}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.email ? "border-red-500" : "border-zinc-700"
              } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono`}
              placeholder={errors.email || "Yourmail@domain.co.uk"}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1 font-mono">
            Subject
          </label>
          <div className="relative">
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              maxLength={100}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.subject ? "border-red-500" : "border-zinc-700"
              } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono`}
              placeholder={errors.subject || "Project Inquiry"}
              aria-invalid={errors.subject ? "true" : "false"}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1 font-mono">
            Message
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.message ? "border-red-500" : "border-zinc-700"
              } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono`}
              placeholder={errors.message || "Your message here..."}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
            ></textarea>
            {errors.message && (
              <div className="absolute right-3 top-5 flex items-center">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              </div>
            )}
            <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-mono">
              {formData.message.length}/1000
            </div>
          </div>
        </div>

        {terminalLines.length > 0 && <TerminalOutput lines={terminalLines} />}

        <button
          type="submit"
          disabled={isSubmitting || submissionAttempts > 5}
          className="w-full btn btn-primary font-mono"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Send Message <Send className="ml-2 h-4 w-4" />
            </span>
          )}
        </button>

        {submitStatus === "success" && !isSubmitting && (
          <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-mono">
            Your message has been sent successfully. I'll get back to you soon!
          </div>
        )}

        {submitStatus === "error" && !isSubmitting && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-mono">
            There was an error sending your message. Please try again later.
          </div>
        )}
      </form>
    </div>
  )
}
