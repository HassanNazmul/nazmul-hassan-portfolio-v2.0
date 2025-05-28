import { getTerminalDateTime } from "@/utils/date-time"
import { projects } from "@/data/projects"

export const projectsTerminalCommand = "git clone https://github.com/HassanNazmul"

export const projectsTerminalOutputs = () => {
  // Use the utility function for consistent date-time formatting
  const currentDateTime = getTerminalDateTime()

  // Generate project file listings dynamically from the projects data
  const projectFileListings = projects.map(
    (project) =>
      `-rw-r--r--  1 nazmul  staff  ${(Math.random() * 3 + 1.5).toFixed(1)}K ${currentDateTime} ${project.title.toLowerCase().replace(/\s+/g, "-")}.project`,
  )

  return [
    "Cloning into 'projects'...",
    "remote: Enumerating objects: 247, done.",
    "remote: Counting objects: 100% (247/247), done.",
    "remote: Compressing objects: 100% (203/203), done.",
    "Receiving objects: 100% (247/247), 42.5 MiB | 10.2 MiB/s, done.",
    "Resolving deltas: 100% (124/124), done.",
    "",
    "$ cd projects",
    "$ ls -la",
    "total 8",
    `drwxr-xr-x  2 nazmul  staff  256 ${currentDateTime} .`,
    `drwxr-xr-x 12 nazmul  staff  384 ${currentDateTime} ..`,
    ...projectFileListings,
    "",
    "$ cat README.md",
    "# Nazmul Hassan's Project Portfolio",
    "A collection of machine learning, data science, and AI projects.",
    "Each project demonstrates different technical skills and problem-solving approaches.",
    "",
    "Projects successfully loaded. Displaying portfolio...",
  ]
}
