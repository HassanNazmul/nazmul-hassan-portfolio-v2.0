import { projects } from "@/data/projects"
import { skills } from "@/data/skills"
import { experiences } from "@/data/experience"
import { getCurrentTime } from "@/utils/date-time"

export const heroTerminalCommand = "python portfolio.py --render --mode=interactive"

// Update the heroTerminalOutputs to include dynamic data
export const heroTerminalOutputs = () => {
  // Use the utility functions for consistent formatting
  const formattedTime = getCurrentTime()

  // Use actual counts from data files
  const projectCount = projects.length
  const skillCount = skills.length
  const experienceCount = experiences.length

  // Random memory usage for a more dynamic terminal feel
  const memoryUsage = Math.floor(Math.random() * 300) + 200 // 200-500 MB

  return [
    `[${formattedTime}] Initializing portfolio environment...`,
    "Loading UI components and styles...",
    "$ cd ~/workspace/nahid.dev",
    "$ python start.py --mode=interactive",
    "→ Initialising environment: Python, React, Tailwind",
    "→ Importing core modules: skills, projects, experience",
    "→ Connecting to PostgreSQL database...",
    `→ Loaded ${projectCount} projects, ${skillCount} skills, ${experienceCount} experience items`,
    "→ Setting up responsive layout and animations...",
    `[INFO] Memory usage: ${memoryUsage}MB`,
    "Portfolio server running at https://NazmulHassan.dev",
    ">>> show.sections()",
    "['hero', 'skills', 'projects', 'experience', 'philosophy', 'contact']",
    ">>> skills.top()",
    "['Machine Learning', 'AI Agent Dev', 'Backend Engineering']",
    ">>> render.portfolio()",
    `Portfolio ready at ${formattedTime}`,
  ]
}
