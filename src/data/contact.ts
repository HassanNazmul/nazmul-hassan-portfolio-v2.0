import { Mail, MapPin, Linkedin, Github, Code } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface ContactItem {
  icon: LucideIcon
  title: string
  value: string
  link?: string
  color: string
}

export interface AvailabilityInfo {
  status: string
  message: string
  isAvailable: boolean
}

export const contactInfo: ContactItem[] = [
  {
    icon: Mail,
    title: "Email",
    value: "nazmul.naaz96@gmail.com",
    link: "mailto:nazmul.naaz96@gmail.com",
    color: "blue",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    value: "linkedin.com/in/nhassan96",
    link: "https://linkedin.com/in/nhassan96",
    color: "blue",
  },
  {
    icon: Github,
    title: "GitHub",
    value: "github.com/HassanNazmul",
    link: "https://github.com/HassanNazmul",
    color: "slate",
  },
  {
    icon: Code,
    title: "Portfolio",
    value: "nazmulhassan.dev",
    link: "https://nazmulhassan.dev",
    color: "green",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "London, United Kingdom",
    color: "cyan",
  },
]

export const availabilityInfo: AvailabilityInfo = {
  status: "Open to new opportunities",
  message: "Currently available for freelance projects, consulting, and full-time opportunities.",
  isAvailable: true,
}
