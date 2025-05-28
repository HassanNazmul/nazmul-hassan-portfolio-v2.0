"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, memo, useCallback } from "react"
import { Briefcase, GraduationCap, Award, FileText, Calendar, MapPin } from "lucide-react"
import type { ExperienceItem } from "./index"

// Memoize category configuration to prevent recreation on each render
const categoryConfig = {
  work: {
    name: "Work Experience",
    icon: <Briefcase className="h-5 w-5" />,
    color: "from-blue-500 to-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    dotColor: "bg-blue-500",
    hexColor: "#3b82f6", // Added hex color for work
  },
  education: {
    name: "Education",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "from-cyan-500 to-teal-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    dotColor: "bg-cyan-500",
    hexColor: "#06b6d4", // Added hex color for education
  },
  certification: {
    name: "Certifications",
    icon: <Award className="h-5 w-5" />,
    color: "from-green-500 to-emerald-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    dotColor: "bg-green-500",
    hexColor: "#10b981", // Added hex color for certification
  },
  publication: {
    name: "Publications",
    icon: <FileText className="h-5 w-5" />,
    color: "from-purple-500 to-indigo-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    iconColor: "text-teal-400",
    dotColor: "bg-teal-500",
    hexColor: "#14b8a6", // Added hex color for publication
  },
}

interface ExperienceTimelineProps {
  experiences: ExperienceItem[]
  visibleItems: number[]
}

function ExperienceTimeline({ experiences, visibleItems }: ExperienceTimelineProps) {
  const [filter, setFilter] = useState<"all" | "work" | "education" | "certification" | "publication">("all")
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Optimize resize listener with throttle
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
  const handleFilterChange = useCallback(
    (newFilter: "all" | "work" | "education" | "certification" | "publication") => {
      setFilter(newFilter)
    },
    [],
  )

  // Memoize filtered experiences to prevent recalculation on every render
  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => filter === "all" || exp.type === filter)
  }, [experiences, filter])

  // Memoize the isMobile value
  const isMobile = useMemo(() => windowWidth <= 768, [windowWidth])

  return (
    <div className="space-y-8" ref={containerRef}>
      {/* Category filters - responsive scrollable container for small screens */}
      <div className="relative">
        <div className="flex items-center justify-center overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 snap-x">
          <FilterButton active={filter === "all"} onClick={() => handleFilterChange("all")} label="All" />

          {Object.entries(categoryConfig).map(([key, category]) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => handleFilterChange(key as "work" | "education" | "certification" | "publication")}
              label={category.name}
              icon={category.icon}
              color={category.color}
              iconColor={category.iconColor}
            />
          ))}
        </div>

        {/* Fade effect for scrollable container */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
      </div>

      {/* Timeline */}
      <div className="relative timeline-container py-10">
        {/* Timeline line */}
        <div className="timeline-line"></div>

        <div className="space-y-24">
          {filteredExperiences.map((exp, index) => (
            <MemoizedTimelineItem
              key={exp.id}
              experience={exp}
              index={index}
              isVisible={visibleItems.includes(exp.id)}
              isEven={index % 2 === 0}
              delay={index * 0.1} // Reduced delay for faster rendering
              isMobile={isMobile}
            />
          ))}
        </div>
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
        className={`px-4 py-2 text-sm rounded-md transition-all font-mono whitespace-nowrap flex-shrink-0 mr-2 snap-start flex items-center backdrop-blur-sm ${
          active
            ? icon
              ? `bg-gradient-to-r ${color} text-white shadow-sm`
              : "bg-blue-600 text-white shadow-sm"
            : "bg-zinc-800/70 text-slate-300 hover:bg-zinc-700/70 hover:text-white"
        }`}
        style={{
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          letterSpacing: "0.02em",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {icon && <span className={active ? "text-white mr-1" : `${iconColor} mr-1`}>{icon}</span>}
        {label}
        {active && <span className="absolute inset-0 bg-white/10 filter-button-shine"></span>}
      </button>
    )
  },
)

FilterButton.displayName = "FilterButton"

// Props interface for TimelineItem
interface TimelineItemProps {
  experience: ExperienceItem
  index: number
  isVisible: boolean
  isEven: boolean
  delay: number
  isMobile: boolean
}

// Base TimelineItem component
function TimelineItem({ experience, index, isVisible, isEven, delay, isMobile }: TimelineItemProps) {
  const config = categoryConfig[experience.type]

  // Precompute styles to avoid recalculation during render
  const dotStyle = useMemo(
    () => ({
      left: isMobile ? "20px" : isEven ? "calc(50% - 12px)" : "calc(50% - 12px)",
      top: "24px",
    }),
    [isMobile, isEven],
  )

  const contentStyle = useMemo(
    () => ({
      width: isMobile ? "calc(100% - 40px)" : "calc(50% - 50px)",
      marginLeft: isMobile ? "40px" : isEven ? "0" : "auto",
      marginRight: isMobile ? "0" : isEven ? "auto" : "0",
    }),
    [isMobile, isEven],
  )

  const badgeStyle = useMemo(() => {
    const colorMap = {
      work: "59, 130, 246",
      education: "6, 182, 212",
      certification: "34, 197, 94",
      publication: "168, 85, 247",
    }

    const color = colorMap[experience.type]

    return {
      color: `rgb(${color})`,
      background: `rgba(${color}, 0.1)`,
      borderLeft: `3px solid rgb(${color})`,
      boxShadow: `0 2px 10px rgba(${color}, 0.2)`,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      textRendering: "optimizeLegibility",
      fontSmooth: "always",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      letterSpacing: "0.02em",
      position: "relative",
      overflow: "hidden",
    } as React.CSSProperties
  }, [experience.type])

  // Memoize the description list to prevent re-renders
  const descriptionList = useMemo(() => {
    const colorMap = {
      work: "blue",
      education: "cyan",
      certification: "green",
      publication: "purple",
    }

    return experience.description.map((item, idx) => (
      <li key={idx} className="flex items-start">
        <span className={`text-${colorMap[experience.type]}-500 mr-2`}>•</span>
        {item}
      </li>
    ))
  }, [experience.description, experience.type])

  return (
    <div
      data-index={index}
      className={`relative timeline-item ${isVisible ? "animate-fadeIn" : "opacity-0"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Timeline dot with holographic interface */}
      <div
        className="timeline-dot-container"
        style={{
          ...dotStyle,
          willChange: "transform, opacity",
        }}
      >
        <div className="hologram-container">
          {/* Outer hexagon */}
          <div className="hologram-hexagon" style={{ borderColor: config.hexColor }}></div>

          {/* Inner circle */}
          <div className="hologram-circle" style={{ borderColor: config.hexColor }}></div>

          {/* Core dot */}
          <div className="hologram-core" style={{ backgroundColor: config.hexColor }}></div>

          {/* Scanning effect */}
          <div className="hologram-scan" style={{ backgroundColor: config.hexColor }}></div>

          {/* Holographic elements */}
          <div className="hologram-element element-1" style={{ backgroundColor: config.hexColor }}></div>
          <div className="hologram-element element-2" style={{ backgroundColor: config.hexColor }}></div>
          <div className="hologram-element element-3" style={{ backgroundColor: config.hexColor }}></div>
          <div className="hologram-element element-4" style={{ backgroundColor: config.hexColor }}></div>

          {/* Holographic rings */}
          <div className="hologram-ring ring-1" style={{ borderColor: config.hexColor }}></div>
          <div className="hologram-ring ring-2" style={{ borderColor: config.hexColor }}></div>

          {/* Glow effect */}
          <div className="hologram-glow" style={{ boxShadow: `0 0 15px ${config.hexColor}` }}></div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`timeline-content ${isEven && !isMobile ? "mr-auto" : !isEven && !isMobile ? "ml-auto" : ""}`}
        style={{
          ...contentStyle,
          willChange: "transform",
        }}
      >
        {/* Category badge */}
        <div className={`category-badge ${config.bgColor} font-medium`} style={badgeStyle}>
          <span className={`${config.iconColor} mr-2 opacity-100`}>{config.icon}</span>
          <span className="font-semibold tracking-wide">{config.name}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-white font-orbitron mb-2">{experience.title}</h3>

        {/* Organization */}
        <div className={`text-lg ${config.iconColor} font-medium font-mono mb-1`}>{experience.organization}</div>

        {/* Period */}
        <div className="text-slate-400 text-sm font-mono mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {experience.period}
        </div>

        {/* Location */}
        {experience.location && (
          <div className="text-slate-400 text-sm font-mono mb-4 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {experience.location}
          </div>
        )}

        {/* Description - using transform: translateZ(0) to force GPU acceleration */}
        <ul className="space-y-2 text-slate-300 text-sm font-mono" style={{ transform: "translateZ(0)" }}>
          {descriptionList}
        </ul>
      </div>
    </div>
  )
}

// Memoize TimelineItem to prevent unnecessary re-renders
const MemoizedTimelineItem = memo(TimelineItem, (prevProps, nextProps) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.experience.id === nextProps.experience.id
  )
})

export default memo(ExperienceTimeline)
