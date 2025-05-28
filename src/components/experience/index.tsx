"use client"

import { useState, useEffect, useRef } from "react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"
import ExperienceTimeline from "./experience-timeline"
import "./experience-styles.css"
import { experiences } from "@/data/experience"

export type ExperienceItem = {
  id: number
  title: string
  organization: string
  period: string
  description: string[]
  type: "work" | "education" | "certification" | "publication"
  location?: string
}

export default function Experience() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  // Create animated stars background with increased count and variety
  useEffect(() => {
    if (!starsRef.current) return

    const starsContainer = starsRef.current
    // Increased star count from 50 to 150
    const starCount = 150

    // Clear any existing stars
    starsContainer.innerHTML = ""

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "experience-star"

      // Random position
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`

      // More varied sizes - some larger stars
      const size = Math.random() * 4 + 0.5
      star.style.width = `${size}px`
      star.style.height = `${size}px`

      // Random animation delay
      star.style.animationDelay = `${Math.random() * 5}s`

      // Random animation duration for more natural effect
      star.style.animationDuration = `${4 + Math.random() * 4}s`

      // Vary opacity for depth effect
      star.style.opacity = `${0.1 + Math.random() * 0.6}`

      // Add some color variation
      if (i % 5 === 0) {
        // Every 5th star is blue
        star.style.backgroundColor = "rgba(0, 80, 255, 0.7)"
      } else if (i % 7 === 0) {
        // Every 7th star is green
        star.style.backgroundColor = "rgba(0, 255, 140, 0.7)"
      }
      // The rest remain cyan as default

      starsContainer.appendChild(star)
    }

    // Add a few special "shooting stars"
    for (let i = 0; i < 5; i++) {
      const shootingStar = document.createElement("div")
      shootingStar.className = "experience-shooting-star"

      // Random position
      shootingStar.style.left = `${Math.random() * 100}%`
      shootingStar.style.top = `${Math.random() * 100}%`

      // Random animation delay
      shootingStar.style.animationDelay = `${Math.random() * 15}s`

      starsContainer.appendChild(shootingStar)
    }
  }, [isInView])

  // Optimize intersection observer to only trigger once
  useEffect(() => {
    // Create observer only once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)

            // Use requestIdleCallback to defer non-critical work
            if (typeof window.requestIdleCallback === "function") {
              window.requestIdleCallback(
                () => {
                  setVisibleItems(experiences.map((exp) => exp.id))
                },
                { timeout: 500 },
              )
            } else {
              // Fallback for browsers that don't support requestIdleCallback
              setTimeout(() => {
                setVisibleItems(experiences.map((exp) => exp.id))
              }, 300)
            }

            // Disconnect observer after triggering
            observerRef.current?.disconnect()
          }
        },
        {
          threshold: 0.1,
          // Use passive option for better performance
          // passive: true,
        },
      )
    }

    if (sectionRef.current && observerRef.current) {
      observerRef.current.observe(sectionRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [isInView])

  return (
    <MatrixGrid className="py-20 relative overflow-hidden" id="experience" color="blue">
      {/* Animated stars background */}
      <div ref={starsRef} className="absolute inset-0 -z-10 experience-stars-container"></div>

      <div ref={sectionRef} className="text-center mb-16">
        <h2 className="section-title">Experience & Education</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-mono">
          My professional journey, academic background, and achievements.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {isInView && <ExperienceTimeline experiences={experiences} visibleItems={visibleItems} />}
      </div>
    </MatrixGrid>
  )
}
