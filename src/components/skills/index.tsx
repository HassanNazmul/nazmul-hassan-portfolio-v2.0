"use client"

import { useState, useEffect, useRef } from "react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"
import SkillCards from "./skill-cards"
import SkillsTerminal from "./skills-terminal"
import TechnicalProficiency from "./technical-proficiency"
import "./skills-styles.css"
import type { Skill as SkillType } from "@/data/skills"

export type Skill = SkillType

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
  const [visibleSkills, setVisibleSkills] = useState<number[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
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
      star.className = "skills-star"

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

  // This effect is for the intersection observer to detect when skill cards are visible
  useEffect(() => {
    // Only set up the observer if analysis is complete and cards are rendered
    if (!analysisComplete) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleSkills((prev) => [...prev, index])
          }
        })
      },
      { threshold: 0.1 },
    )

    // Small timeout to ensure DOM elements are ready
    const timer = setTimeout(() => {
      document.querySelectorAll(".skill-card").forEach((card) => {
        observer.observe(card)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [analysisComplete]) // Re-run when analysis is complete and cards are rendered

  const handleAnalysisComplete = () => {
    setAnalysisComplete(true)
  }

  return (
    <MatrixGrid className="py-20 relative overflow-hidden" id="skills" color="green" intensity="light">
      {/* Animated stars background */}
      <div ref={starsRef} className="absolute inset-0 -z-10 skills-stars-container"></div>

      <div className="text-center mb-16">
        <h2 className="section-title">Technical Skills</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-mono">
          A comprehensive overview of my technical expertise and proficiency in various technologies.
        </p>
      </div>

      <SkillsTerminal onAnalysisComplete={handleAnalysisComplete} />

      {analysisComplete && (
        <div className="skill-cards-container max-w-7xl mx-auto">
          <SkillCards activeSkill={activeSkill} setActiveSkill={setActiveSkill} visibleSkills={visibleSkills} />
        </div>
      )}

      <TechnicalProficiency />
    </MatrixGrid>
  )
}
