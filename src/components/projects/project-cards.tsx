"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, memo, useCallback } from "react"
import Image from "next/image"
import { Github, ExternalLink, Code, Cpu, Database, Brain } from "lucide-react"
import type { Project } from "./index"

// Category configuration with colors and icons - moved outside component
const categoryConfig = {
  ml: {
    name: "Machine Learning",
    icon: <Brain className="h-4 w-4 mr-1" />,
    color: "from-green-500 to-emerald-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
  },
  web: {
    name: "Web Development",
    icon: <Code className="h-4 w-4 mr-1" />,
    color: "from-cyan-500 to-teal-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  data: {
    name: "Data Science",
    icon: <Database className="h-4 w-4 mr-1" />,
    color: "from-blue-500 to-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
}

interface ProjectCardsProps {
  projects: Project[]
  visibleProjects: number[]
}

function ProjectCards({ projects, visibleProjects }: ProjectCardsProps) {
  const [filter, setFilter] = useState<"all" | "ml" | "web" | "data">("all")
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle window resize with throttling
  useEffect(() => {
    let ticking = false
    let lastWidth = windowWidth

    const handleResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentWidth = window.innerWidth
          // Only update if width changed by at least 50px to reduce updates
          if (Math.abs(currentWidth - lastWidth) > 50) {
            setWindowWidth(currentWidth)
            lastWidth = currentWidth
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [windowWidth])

  // Memoize filter change handler
  const handleFilterChange = useCallback((newFilter: "all" | "ml" | "web" | "data") => {
    setFilter(newFilter)
  }, [])

  // Filter projects based on active category - memoized
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => filter === "all" || project.category === filter)
  }, [projects, filter])

  // Determine grid columns based on screen width - memoized
  const gridColsClass = useMemo(() => {
    if (windowWidth < 640) return "grid-cols-1 gap-4" // sm
    if (windowWidth < 1024) return "grid-cols-2 gap-6" // md and lg
    return "grid-cols-3 gap-6" // xl and above
  }, [windowWidth])

  return (
    <div className="space-y-8" ref={containerRef}>
      {/* Category filters */}
      <div className="relative">
        <div className="flex items-center justify-center flex-wrap gap-3 mb-6">
          <FilterButton active={filter === "all"} onClick={() => handleFilterChange("all")} label="All Projects" />

          {Object.entries(categoryConfig).map(([key, category]) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => handleFilterChange(key as "ml" | "web" | "data")}
              label={category.name}
              icon={category.icon}
              color={category.color}
              iconColor={category.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Projects grid */}
      <div className={`grid ${gridColsClass}`}>
        {filteredProjects.map((project, index) => (
          <MemoizedProjectCard
            key={project.id}
            project={project}
            index={projects.findIndex((p) => p.id === project.id)}
            isVisible={visibleProjects.includes(project.id)}
            delay={index * 0.2}
          />
        ))}
      </div>
    </div>
  )
}

// Extracted FilterButton component to reduce re-renders
const FilterButton = memo(
  ({
    active,
    onClick,
    label,
    icon,
    color,
    iconColor,
  }: {
    active: boolean
    onClick: () => void
    label: string
    icon?: React.ReactNode
    color?: string
    iconColor?: string
  }) => {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 text-sm rounded-md transition-all font-mono flex items-center ${
          active
            ? icon
              ? `bg-gradient-to-r ${color} text-white`
              : "bg-blue-600 text-white"
            : "bg-zinc-800/70 text-slate-300 hover:bg-zinc-700/70 hover:text-white"
        }`}
      >
        {icon && <span className={active ? "text-white" : iconColor}>{icon}</span>}
        {label}
      </button>
    )
  },
)

FilterButton.displayName = "FilterButton"

// ProjectCard component
function ProjectCard({
  project,
  index,
  isVisible,
  delay,
}: {
  project: Project
  index: number
  isVisible: boolean
  delay: number
}) {
  const config = categoryConfig[project.category]

  // Memoize the tag list to prevent re-renders
  const tagList = useMemo(() => {
    return project.tags.map((tag, idx) => (
      <span
        key={idx}
        className={`px-2 py-1 text-xs rounded-md ${config.bgColor} text-slate-300 transition-colors duration-200 hover:bg-opacity-50`}
      >
        {tag}
      </span>
    ))
  }, [project.tags, config.bgColor])

  // Memoize the category icon
  const categoryIcon = useMemo(() => {
    if (project.category === "ml") return <Cpu className="h-5 w-5" />
    if (project.category === "web") return <Code className="h-5 w-5" />
    return <Database className="h-5 w-5" />
  }, [project.category])

  return (
    <div
      data-index={index}
      className={`relative overflow-hidden rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 project-card group ${
        project.featured ? config.borderColor : ""
      } ${isVisible ? "animate-fadeIn" : "opacity-0"}`}
      style={{
        animationDelay: `${delay}s`,
        contain: "content",
      }}
    >
      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {project.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs px-2 py-1 rounded-md font-mono">
            Featured
          </div>
        )}

        {/* GitHub link button - bottom left, visible on hover */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 left-3 p-2 rounded-full bg-black/80 text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 z-10"
          aria-label="View GitHub Repository"
        >
          <Github className="h-5 w-5" />
        </a>

        {/* Demo link button - bottom right, visible on hover (if demo exists) */}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/80 text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 z-10"
            aria-label="View Live Demo"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`h-5 w-5 ${config.iconColor} mr-2`}>{categoryIcon}</span>
          <h3 className="text-xl font-semibold text-white font-orbitron">{project.title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4 font-mono line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-2">{tagList}</div>
      </div>
    </div>
  )
}

// Memoize ProjectCard to prevent unnecessary re-renders
const MemoizedProjectCard = memo(ProjectCard, (prevProps, nextProps) => {
  return prevProps.isVisible === nextProps.isVisible && prevProps.project.id === nextProps.project.id
})

export default memo(ProjectCards)
