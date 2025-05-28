"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Skill } from "./index"
import { skills, categoryConfig } from "@/data/skills"

interface SkillCardsProps {
  activeSkill: Skill | null
  setActiveSkill: (skill: Skill | null) => void
  visibleSkills: number[]
}

export default function SkillCards({ activeSkill, setActiveSkill, visibleSkills }: SkillCardsProps) {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Determine grid columns based on screen width
  const getGridCols = () => {
    if (windowWidth < 640) return "grid-cols-1 gap-4" // sm
    if (windowWidth < 768) return "grid-cols-2 gap-4" // md
    if (windowWidth < 1024) return "grid-cols-2 gap-6" // lg
    if (windowWidth < 1280) return "grid-cols-3 gap-6" // xl
    return "grid-cols-4 gap-6" // 2xl and above
  }

  return (
    <div className="space-y-8" ref={containerRef}>
      {/* Skills grid */}
      <div className={`grid ${getGridCols()}`}>
        {skills.map((skill, index) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            index={index}
            isActive={activeSkill?.name === skill.name}
            onClick={() => setActiveSkill(activeSkill?.name === skill.name ? null : skill)}
            categoryKey={skill.category as keyof typeof categoryConfig}
            delay={index * 0.15}
            isVisible={visibleSkills.includes(index)}
          />
        ))}
      </div>
    </div>
  )
}

// Extracted SkillCard component for better organization
function SkillCard({
  skill,
  index,
  isActive,
  onClick,
  categoryKey,
  delay,
  isVisible,
}: {
  skill: Skill
  index: number
  isActive: boolean
  onClick: () => void
  categoryKey: keyof typeof categoryConfig
  delay: number
  isVisible: boolean
}) {
  const config = categoryConfig[categoryKey]

  return (
    <div
      data-index={index}
      className={`relative overflow-hidden rounded-lg bg-zinc-900/50 backdrop-blur-sm border p-5 transition-all duration-300 cursor-pointer skill-card h-full ${
        isActive
          ? `${config.borderColor} shadow-[0_0_20px_rgba(0,80,255,0.2)]`
          : "border-zinc-800 hover:border-zinc-700"
      } ${isVisible ? "animate-fadeIn" : "opacity-0"}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      {/* Category indicator */}
      <div
        className="absolute top-0 right-0 w-2 h-8 rounded-bl-md rounded-tr-md bg-gradient-to-b opacity-70 transition-opacity duration-300 hover:opacity-100"
        style={
          {
            background: `linear-gradient(to bottom, var(--tw-gradient-stops))`,
            "--tw-gradient-from": `rgb(${categoryKey === "languages" ? "59, 130, 246" : categoryKey === "ai" ? "34, 197, 94" : categoryKey === "development" ? "6, 182, 212" : "168, 85, 247"})`,
            "--tw-gradient-to": `rgb(${categoryKey === "languages" ? "96, 165, 250" : categoryKey === "ai" ? "110, 231, 183" : categoryKey === "development" ? "45, 212, 191" : "129, 140, 248"})`,
            "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)",
          } as React.CSSProperties
        }
      ></div>

      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>{skill.icon}</div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-white font-orbitron truncate">{skill.name}</h3>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2 mt-1">
            <div
              className={`bg-gradient-to-r ${config.color} h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 text-slate-300 text-sm font-mono transition-all duration-300 ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <p className="line-clamp-3">{skill.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {skill.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 text-xs rounded-md ${config.bgColor} text-slate-300 transition-colors duration-200 hover:bg-opacity-50`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
