import { skills } from "@/data/skills"
import { getTerminalDateTime } from "@/utils/date-time"

export const skillsTerminalCommand = "ls -la skills/ --analyze --verbose"

export const skillsTerminalOutputs = () => {
  // Use the utility function for consistent date-time formatting
  const currentDate = getTerminalDateTime()

  // Generate dynamic file listings based on actual skills data
  const skillFileListings = skills.map((skill) => {
    // Convert skill name to kebab-case filename
    const fileName = skill.name.toLowerCase().replace(/\s+/g, "-") + ".skill"

    // Generate random file size between 1.5K and 3.5K
    const fileSize = (Math.random() * 2 + 1.5).toFixed(1) + "K"

    // Generate random permissions (mostly read-write for owner, read for others)
    const permissions = "-rw-r--r--"

    // Return formatted file listing
    return `${permissions}  1 nazmul  staff  ${fileSize} ${currentDate} ${fileName}`
  })

  // Create the complete terminal output
  return [
    "total 8",
    `drwxr-xr-x  2 nazmul  staff  256 ${currentDate} .`,
    `drwxr-xr-x 12 nazmul  staff  384 ${currentDate} ..`,
    ...skillFileListings,
    "",
    "Analyzing skill proficiency...",
    "Scanning technical capabilities...",
    "Evaluating expertise levels...",
    "Generating skill matrix...",
    "Skills analysis complete. Displaying results:",
  ]
}
