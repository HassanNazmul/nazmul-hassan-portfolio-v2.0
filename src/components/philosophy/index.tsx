"use client"

import { useState, useRef, useEffect, memo } from "react"
import { Quote, Star } from "lucide-react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"
import PhilosophyTerminal from "./philosophy-terminal"
import "./philosophy-styles.css"

function Philosophy() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  // Improved intersection observer implementation
  useEffect(() => {
    // Create observer only once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)

            // Disconnect observer after triggering to improve performance
            observerRef.current?.disconnect()
          }
        },
        {
          threshold: 0.2, // Trigger when 20% of the element is visible
          rootMargin: "50px", // Start loading a bit earlier
        },
      )
    }

    if (sectionRef.current && observerRef.current) {
      observerRef.current.observe(sectionRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [isVisible])

  // Create animated stars background
  useEffect(() => {
    if (!isVisible || !starsRef.current) return

    const starsContainer = starsRef.current
    const starCount = 50

    // Clear any existing stars
    starsContainer.innerHTML = ""

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "philosophy-star"

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
  }, [isVisible])

  return (
    <MatrixGrid className="py-20 relative overflow-hidden" color="cyan" intensity="medium" id="philosophy">
      {/* Animated stars background */}
      <div ref={starsRef} className="absolute inset-0 -z-10 stars-container"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-blue-900/20 via-transparent to-transparent opacity-30"></div>

      <div ref={sectionRef} className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Life Philosophy</h2>
        </div>

        <div className={`philosophy-container ${isVisible ? "visible" : ""}`}>
          <div className="max-w-3xl mx-auto">
            {/* Terminal Section */}
            <div className="terminal-container p-8 rounded-xl shadow-lg">
              {isVisible && (
                <>
                  <div className="quote-container mb-6 p-6 rounded-xl bg-zinc-900/80 border border-zinc-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                    <div className="absolute -top-6 -left-6 text-blue-500/10">
                      <Quote size={60} />
                    </div>

                    <blockquote className="relative z-10">
                      <p className="text-lg md:text-xl font-medium text-white leading-relaxed font-orbitron mb-4 quote-text">
                        &#34;The best among you are those who bring the greatest benefits to others&#34;
                      </p>
                      <footer className="flex items-center justify-end">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mr-2"></div>
                        <cite className="text-cyan-400 font-orbitron not-italic text-sm">Prophet Muhammad (PBUH)</cite>
                      </footer>
                    </blockquote>

                    <div className="absolute bottom-0 right-0 w-16 h-16 text-cyan-500/10">
                      <Star size={60} />
                    </div>
                  </div>

                  <PhilosophyTerminal />
                </>
              )}

              <div className="mt-6 flex items-center justify-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <p className="mx-4 text-lg font-medium text-white font-orbitron">Nazmul Hassan</p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MatrixGrid>
  )
}

export default memo(Philosophy)
