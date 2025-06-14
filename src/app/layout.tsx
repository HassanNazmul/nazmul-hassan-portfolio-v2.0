import type React from "react"
import type { Metadata } from "next/types"
import { JetBrains_Mono, Orbitron } from "next/font/google"
import "./globals.css" // Only import the main globals.css

// Import the TerminalProvider
import { TerminalProvider } from "@/contexts/terminal-context"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title:
    "Software Engineer | Python Developer | Machine Learning & AI Engineer | AI Agent Builder | MSc AI (QMUL)",
  description:
    "Portfolio of Nazmul Hassan - Machine Learning Engineer, AI Specialist, Data Scientist, and Backend Developer",
  keywords:
    "Nazmul Hassan, Software Engineer, Python Developer, Machine Learning Engineer, AI Specialist, Data Scientist, Backend Developer, AI Agent Builder, MSc AI QMUL",
};

// Wrap the children with TerminalProvider in the RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jetbrainsMono.variable} ${orbitron.variable} font-mono bg-black text-slate-200 antialiased overflow-x-hidden`}
      >
        <TerminalProvider>{children}</TerminalProvider>
      </body>
    </html>
  )
}
