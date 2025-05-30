"use client"

import { useState, useEffect, useRef, memo } from "react"
import { projectsTerminalCommand, projectsTerminalOutputs } from "@/data/terminal-messages/projects"

interface ProjectsTerminalProps {
  onCloneComplete: () => void
}

// Create a memoized terminal line component
const TerminalLine = memo(({ line }: { line: string }) => {
  // Helper function to format file listing with proper styling
  const formatFileListing = (text: string) => {
    if (text.endsWith(".project") || text.endsWith(".") || text.endsWith("..")) {
      const parts = text.split(/\s+/)
      const permissions = parts[0]
      const fileName = parts[parts.length - 1]
      const middle = parts.slice(1, -1).join(" ")

      return (
        <>
          <span className="file-permission">{permissions}</span>
          <span> {middle} </span>
          <span className="file-name">{fileName}</span>
        </>
      )
    }
    return text
  }

  if (line.startsWith("$")) {
    return (
      <>
        <span className="text-green-400 mr-2">$</span>
        <span className="text-white ml-2">{line.substring(2)}</span>
      </>
    )
  } else if (line.startsWith("#")) {
    return <span className="text-cyan-400">{line}</span>
  } else if (
    line.startsWith("Cloning") ||
    line.startsWith("remote:") ||
    line.startsWith("Receiving") ||
    line.startsWith("Resolving") ||
    line.startsWith("Projects successfully")
  ) {
    return <span className="process-message">{line}</span>
  }

  return <span className="text-slate-300 pl-4">{formatFileListing(line)}</span>
})

TerminalLine.displayName = "TerminalLine"

function ProjectsTerminal({ onCloneComplete }: ProjectsTerminalProps) {
  const [commandText, setCommandText] = useState("")
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  // const [isInView, setIsInView] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  // const [cloneComplete, setCloneComplete] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the terminalOutputs array to use dynamic timestamps
  const fullCommand = projectsTerminalCommand

  // Memoize terminal outputs to prevent recreation
  const terminalOutputs = useRef(projectsTerminalOutputs()).current

  // Set up intersection observer to detect when terminal is in view
  useEffect(() => {
    if (observerRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Set isInView state based on intersection
        // setIsInView(entry.isIntersecting)

        // If terminal comes into view and hasn't started yet, mark it as started
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      {
        root: null, // viewport
        threshold: 0.5, // trigger when 50% of the element is visible (reduced from 1.0)
        rootMargin: "100px", // start loading earlier
      },
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasStarted])

  // Typing animation for command - only starts when terminal is in view
  useEffect(() => {
    // Only proceed if terminal has started (came into view at least once)
    if (!hasStarted) return

    if (isTypingCommand && commandText.length < fullCommand.length) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(
        () => {
          setCommandText(fullCommand.slice(0, commandText.length + 1))
        },
        Math.random() * 50 + 50, // Random typing speed for realism
      )

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    } else if (isTypingCommand && commandText.length === fullCommand.length) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsTypingCommand(false)
      }, 500) // Pause after command is typed

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [commandText, isTypingCommand, hasStarted, fullCommand])

  // Output lines animation - optimized with requestAnimationFrame
  useEffect(() => {
    // Only proceed if terminal has started and command typing is complete
    if (!hasStarted || isTypingCommand) return

    if (currentLine < terminalOutputs.length) {
      const getNextLine = () => {
        const newLine = terminalOutputs[currentLine]
        setOutputLines((prev) => [...prev, newLine])
        setCurrentLine((prev) => prev + 1)

        // Check if this is the last line (clone complete)
        if (currentLine === terminalOutputs.length - 1) {
          // setCloneComplete(true)
          // Add a small delay before triggering the callback
          setTimeout(() => {
            onCloneComplete()
          }, 500)
        }

        // Scroll to bottom of terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }

      // Use requestAnimationFrame for smoother animations
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Different timing for different types of output
      const delay =
        terminalOutputs[currentLine].startsWith("Cloning") ||
          terminalOutputs[currentLine].startsWith("Projects successfully") ||
          terminalOutputs[currentLine].startsWith("# Nazmul")
          ? 800 // Slower for important messages
          : terminalOutputs[currentLine].startsWith("$")
            ? 600 // Medium for commands
            : terminalOutputs[currentLine] === ""
              ? 300 // Medium for empty lines
              : 150 // Fast for file listings and other outputs

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(getNextLine)
      }, delay)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isTypingCommand, currentLine, hasStarted, onCloneComplete, terminalOutputs])

  // Ensure terminal scrolls to bottom whenever output lines change - optimized
  useEffect(() => {
    if (terminalRef.current && outputLines.length > 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      })
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [outputLines])

  // Cleanup all timers and animation frames on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 font-mono text-sm mb-8 mx-auto max-w-3xl projects-terminal"
      ref={containerRef}
    >
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
        <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
        <span className="ml-2 text-xs text-slate-400">projects@nazmul:~</span>
      </div>
      <div className="terminal-content overflow-y-auto" ref={terminalRef}>
        <div className="flex items-start mb-1">
          <span className="text-green-400 mr-2">$</span>
          <span className="text-white ml-2">{commandText}</span>
          {isTypingCommand && hasStarted && (
            <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle terminal-cursor"></span>
          )}
        </div>

        {outputLines.map((line, index) => (
          <div key={index} className="flex items-start mb-1">
            <TerminalLine line={line} />
          </div>
        ))}

        {!isTypingCommand && currentLine === terminalOutputs.length && hasStarted && (
          <div className="flex items-start mb-1">
            <span className="text-green-400 mr-2">$</span>
            <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle terminal-cursor"></span>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ProjectsTerminal)
