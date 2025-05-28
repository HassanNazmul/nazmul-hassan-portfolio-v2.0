"use client"

import { memo, type ReactNode, forwardRef, useMemo } from "react"

interface MatrixGridProps {
  children: ReactNode
  className?: string
  intensity?: "light" | "medium" | "strong"
  color?: "blue" | "green" | "cyan"
  id?: string
}

// Pre-compute color and opacity values outside the component
const colorValues = {
  blue: "0, 80, 255",
  cyan: "0, 229, 255",
  green: "0, 255, 140",
}

const opacityValues = {
  light: "0.02",
  medium: "0.03",
  strong: "0.05",
}

const MatrixGrid = forwardRef<HTMLDivElement, MatrixGridProps>(
  ({ children, className = "", intensity = "medium", color = "cyan", id }, ref) => {
    // Use useMemo to compute the background style only when dependencies change
    const backgroundStyle = useMemo(() => {
      const selectedColor = colorValues[color]
      const selectedOpacity = opacityValues[intensity]

      return {
        backgroundImage: `linear-gradient(to right, rgba(${selectedColor}, ${selectedOpacity}) 1px, transparent 1px), 
                          linear-gradient(to bottom, rgba(${selectedColor}, ${selectedOpacity}) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        backgroundPosition: "center center",
        // Force GPU acceleration
        transform: "translateZ(0)",
        willChange: "transform",
        contain: "layout paint style",
        width: "100%", // Ensure full width
        height: "100%", // Ensure full height
      }
    }, [color, intensity])

    return (
      <div className={`relative w-full ${className}`} id={id} ref={ref}>
        <div className="absolute inset-0 -z-10" style={backgroundStyle} />
        {children}
      </div>
    )
  },
)

MatrixGrid.displayName = "MatrixGrid"

// Memoize the component to prevent unnecessary re-renders
export default memo(MatrixGrid)
