"use client"

import type React from "react"

import { memo, useState, useEffect } from "react"
import { ArrowRight, Github, Linkedin, Code, FileText } from "lucide-react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"
import HeroTerminal from "./hero-terminal"
import ParticlesCanvas from "./particles-canvas"
import ProfileImage from "./profile-image"
import TypewriterText from "./typewriter-text"
import InitializationIndicator from "./initialization-indicator"
import "./hero-styles.css"

// Import the useTerminal hook
import { useTerminal } from "@/contexts/terminal-context"
import { cvGenerationCommand, cvGenerationOutputs } from "@/data/terminal-messages/cv"

function Hero() {
  // Set to true to enable page locking, false to disable it
  const ENABLE_PAGE_LOCKING = true // Easy toggle for development purposes
  // Array of roles for the typewriter effect
  const roles = ["Software Engineer", "Back End Developer", "Machine Learning Engineer", "AI Agent Developer"]
  const [terminalComplete, setTerminalComplete] = useState(false)
  const { isHeroTerminalComplete, setHeroTerminalComplete, isNavbarLocked } = useTerminal()
  const [isGeneratingCV, setIsGeneratingCV] = useState(false)

  // Effect to prevent scrolling until terminal execution is complete
  useEffect(() => {
    // Only apply page locking if ENABLE_PAGE_LOCKING is true
    if (ENABLE_PAGE_LOCKING) {
      // Store the current scroll position before locking
      const scrollPosition = window.pageYOffset

      // Prevent scrolling when terminal is executing
      if (!terminalComplete) {
        // Lock the body at its current position
        document.body.style.position = "fixed"
        document.body.style.top = `-${scrollPosition}px`
        document.body.style.width = "100%"
      } else {
        // Re-enable scrolling when terminal execution is complete
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""

        // Check if there's a hash in the URL
        if (window.location.hash) {
          // If there's a hash, let the navbar's scroll handling take care of it
          // We'll add a small delay to ensure everything is ready
          setTimeout(() => {
            const targetId = window.location.hash.substring(1)
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
              // Calculate the target position with offset for the fixed header
              const headerOffset = 80 // Adjust based on your header height
              const elementPosition = targetElement.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset

              // Perform the smooth scroll
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              })
            }
          }, 100)
        } else {
          // If no hash, restore the previous scroll position
          window.scrollTo(0, 0)
        }
      }
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [terminalComplete])

  // Add a new useEffect to set the initial URL hash to #home
  useEffect(() => {
    // Only set the hash if there isn't one already and we're at the root URL
    if (!window.location.hash && window.location.pathname === "/") {
      // Use history.replaceState to avoid adding a new entry to the history stack
      window.history.replaceState(null, "", "/#home")
    }
  }, [])

  const handleTerminalComplete = () => {
    setTerminalComplete(true)
    setHeroTerminalComplete(true)
  }

  const handleViewCV = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (!terminalComplete) return // Don't do anything if terminal isn't ready

    // Set loading state
    setIsGeneratingCV(true)

    // Get the addCommand function from the window object
    const terminalAddCommand = (window as any).terminalAddCommand

    if (terminalAddCommand) {
      // Execute the command in the terminal
      const totalDelay = terminalAddCommand(cvGenerationCommand, cvGenerationOutputs)

      // Open the CV after all messages are displayed
      setTimeout(() => {
        window.open("/cv.pdf", "_blank", "noopener,noreferrer")
        // Reset loading state
        setIsGeneratingCV(false)
      }, totalDelay + 500)
    } else {
      // Fallback if terminal command function isn't available
      window.open("/cv.pdf", "_blank", "noopener,noreferrer")
      // Reset loading state
      setIsGeneratingCV(false)
    }
  }

  return (
    <MatrixGrid className="hero-container pt-16" id="home">
      <ParticlesCanvas />

      <div className="container mx-auto px-4 sm:px-6 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-mono bg-zinc-800/50 border border-zinc-700 text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Available for new opportunities
            </div>

            <h1 className="font-orbitron leading-tight">
              <span className="text-2xl sm:text-3xl md:text-2xl block">Hi, I'm</span>
              <span className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 whitespace-nowrap">
                Nazmul Hassan
              </span>
            </h1>

            {/* Typewriter effect for roles */}
            <div className="h-16 sm:h-12">
              <TypewriterText roles={roles} />
            </div>

            <HeroTerminal onInitComplete={handleTerminalComplete} />

            <p className="text-slate-300 max-w-lg font-mono">
              Building intelligent systems and scalable applications with cutting-edge technology. Passionate about
              solving complex problems through code and data.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#contact"
                className={`btn btn-primary font-mono ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
              >
                Get in touch <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/cv.pdf"
                onClick={handleViewCV}
                className={`btn btn-outline font-mono ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
              >
                {isGeneratingCV ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Building CV <FileText className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    View CV <FileText className="ml-2 h-4 w-4" />
                  </span>
                )}
              </a>
            </div>

            <div className="social-links pt-4">
              <a
                href="https://github.com/nazmulhassan"
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link text-slate-400 hover:text-white transition-colors ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/in/nazmulhassan"
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link text-slate-400 hover:text-white transition-colors ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://hackerrank.com/nazmulhassan"
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link text-slate-400 hover:text-white transition-colors ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
                aria-label="HackerRank"
              >
                <Code className="h-6 w-6" />
              </a>
            </div>
          </div>

          <ProfileImage src="/nazmul-profile.jpg" alt="Nazmul Hassan" />
        </div>
      </div>

      {/* Show initialization indicator when terminal is not complete */}
      {!terminalComplete && <InitializationIndicator />}

      {/* Only show scroll indicator when terminal is complete */}
      {terminalComplete && (
        <div className="scroll-indicator">
          <span className="text-sm text-slate-500 mb-2 font-mono">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-1">
            <div className="scroll-dot"></div>
          </div>
        </div>
      )}
    </MatrixGrid>
  )
}

export default memo(Hero)
