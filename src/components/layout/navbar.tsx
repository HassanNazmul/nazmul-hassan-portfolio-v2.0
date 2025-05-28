"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Menu, X, Terminal } from "lucide-react"

// Import the useTerminal hook
import { useTerminal } from "@/contexts/terminal-context"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Philosophy", href: "#philosophy" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { isNavbarLocked } = useTerminal()

  // Handle scroll events with throttling for better performance
  const handleScroll = useCallback(() => {
    // Check if page is scrolled to update navbar background
    setScrolled(window.scrollY > 10)

    // Determine which section is currently in view
    const sections = navLinks.map((link) => link.href.substring(1))

    // Find the current active section by checking which section is in the viewport
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i])
      if (section) {
        const rect = section.getBoundingClientRect()
        // If the section is in the viewport (with some buffer for better UX)
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    // If we're at the top of the page, set Home as active
    if (window.scrollY < 100) {
      setActiveSection("home")
    }
  }, [])

  useEffect(() => {
    // Add throttled scroll event listener
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [handleScroll])

  // Handle smooth scrolling when clicking navigation links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If navbar is locked, prevent navigation
    if (isNavbarLocked) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Close mobile menu if open
      setIsOpen(false)

      // Update active section
      setActiveSection(targetId)

      // Update URL hash without causing a jump
      window.history.pushState(null, "", href)

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
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="#home"
              className={`text-xl font-orbitron tracking-wider ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
              onClick={(e) => handleNavClick(e, "#home")}
            >
              <span className="flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-cyan-500" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                  Nazmul Hassan
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-link font-mono relative ${
                    activeSection === link.href.substring(1)
                      ? "text-white after:w-full"
                      : "text-slate-300 hover:text-white"
                  } ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ${
                      activeSection === link.href.substring(1) ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => !isNavbarLocked && setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-zinc-800 focus:outline-none ${
                isNavbarLocked ? "opacity-70 cursor-not-allowed" : ""
              }`}
              aria-expanded="false"
              disabled={isNavbarLocked}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-mono ${
                  activeSection === link.href.substring(1)
                    ? "text-white bg-zinc-800/70"
                    : "text-slate-300 hover:text-white hover:bg-zinc-800/50"
                } ${isNavbarLocked ? "pointer-events-none opacity-70" : ""}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
