"use client"

import { memo, useState, useEffect } from "react"
import Image from "next/image"

interface ProfileImageProps {
  src: string
  alt: string
}

function ProfileImage({ src, alt }: ProfileImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset the loaded state when the src changes
  useEffect(() => {
    setImageLoaded(false)
  }, [src])

  return (
    <div className="relative mx-auto lg:ml-auto">
      <div className="profile-image-container relative w-64 h-72 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] overflow-hidden">
        {/* Matrix grid background that matches the site background */}
        <div className="matrix-grid-bg absolute inset-0 z-0"></div>

        {/* Glowing border effect */}
        <div className="profile-border-glow absolute inset-0 z-10"></div>

        {/* Image with custom clip path */}
        <div className="absolute inset-2 z-20 matrix-clip-path overflow-hidden">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            priority
            onLoad={() => setImageLoaded(true)}
          />

          {/* Scanline effect overlay */}
          <div className="scanlines absolute inset-0 z-10 opacity-10"></div>
        </div>

        {/* Digital circuit lines */}
        <div className="circuit-line circuit-line-1"></div>
        <div className="circuit-line circuit-line-2"></div>
        <div className="circuit-line circuit-line-3"></div>
        <div className="circuit-line circuit-line-4"></div>

        {/* Digital nodes at corners */}
        <div className="digital-node digital-node-1"></div>
        <div className="digital-node digital-node-2"></div>
        <div className="digital-node digital-node-3"></div>
        <div className="digital-node digital-node-4"></div>
      </div>

      <div className="absolute -bottom-4 -right-4 sm:bottom-0 sm:right-0 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-3 shadow-lg z-30">
        <div className="text-sm font-mono text-slate-300">Tech Stack</div>
        <div className="flex space-x-2 mt-2">
          <div className="tech-badge bg-blue-600/20 text-blue-400">Py</div>
          <div className="tech-badge bg-green-600/20 text-green-400">ML</div>
          <div className="tech-badge bg-cyan-600/20 text-cyan-400">AI</div>
          <div className="tech-badge bg-teal-600/20 text-teal-400">API</div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProfileImage)
