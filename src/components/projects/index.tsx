"use client"

import { useState, useEffect, useRef } from "react"
import { Github } from "lucide-react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"
import ProjectsTerminal from "./projects-terminal"
import ProjectCards from "./project-cards"
import "./projects-styles.css"
import { projects, type Project } from "@/data/projects"

export type { Project }

export default function Projects() {
  const [visibleProjects, setVisibleProjects] = useState<number[]>([])
  const [cloneComplete, setCloneComplete] = useState(false)
  const starsRef = useRef<HTMLDivElement>(null)

  // Create animated stars background
  useEffect(() => {
    if (!starsRef.current) return

    const starsContainer = starsRef.current
    const starCount = 50

    // Clear any existing stars
    starsContainer.innerHTML = ""

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "projects-star"

      // Random position
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`

      // Random size
      const size = Math.random() * 3 + 1
      star.style.width = `${size}px`
      star.style.height = `${size}px`

      // Random animation delay
      star.style.animationDelay = `${Math.random() * 5}s`

      starsContainer.appendChild(star)
    }
  }, [])

  useEffect(() => {
    if (!cloneComplete) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            const projectId = projects[index]?.id
            if (projectId && !visibleProjects.includes(projectId)) {
              setVisibleProjects((prev) => [...prev, projectId])
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    // Small timeout to ensure DOM elements are ready
    const timer = setTimeout(() => {
      document.querySelectorAll(".project-card").forEach((card) => {
        observer.observe(card)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [cloneComplete, visibleProjects])

  const handleCloneComplete = () => {
    setCloneComplete(true)
  }

  return (
    <MatrixGrid className="py-20 relative overflow-hidden" id="projects">
      {/* Animated stars background */}
      <div ref={starsRef} className="absolute inset-0 -z-10 projects-stars-container"></div>

      <div className="text-center mb-16">
        <h2 className="section-title">Projects</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-mono">
          A showcase of my technical projects, research work, and contributions.
        </p>
      </div>

      <ProjectsTerminal onCloneComplete={handleCloneComplete} />

      {cloneComplete && (
        <div className="project-cards-container max-w-7xl mx-auto">
          <ProjectCards projects={projects} visibleProjects={visibleProjects} />
        </div>
      )}

      <div className="text-center mt-12">
        <a
          href="https://github.com/HassanNazmul"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline font-mono"
        >
          View More on GitHub <Github className="ml-2 h-4 w-4" />
        </a>
      </div>
    </MatrixGrid>
  )
}
