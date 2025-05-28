/**
 * Utility functions for consistent date and time formatting across the application
 */

/**
 * Get current date in UK format (e.g., "19 May")
 */
export function getCurrentDate(): string {
  const now = new Date()
  return now
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
    .replace(/,/g, "")
}

/**
 * Get current time in 24-hour format (e.g., "14:30:45")
 */
export function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

/**
 * Get current date and time in terminal format (e.g., "19 May 14:30")
 */
export function getTerminalDateTime(): string {
  const now = new Date()
  return now
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/,/g, "")
}

/**
 * Get full formatted date and time (e.g., "19 May 2023 14:30:45")
 */
export function getFullDateTime(): string {
  const now = new Date()
  return now
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/,/g, "")
}

/**
 * Format a specific date object with terminal-style formatting
 */
export function formatDateForTerminal(date: Date): string {
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/,/g, "")
}
