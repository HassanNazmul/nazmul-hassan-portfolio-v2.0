"use client"

import { useState, useEffect, useRef, memo } from "react"
import { useTerminal } from "@/contexts/terminal-context"
// Update the import to reflect the function call
import { heroTerminalCommand, heroTerminalOutputs } from "@/data/terminal-messages/hero"

interface HeroTerminalProps {
  onInitComplete?: () => void
}

// Create a memoized terminal line component
const TerminalLine = memo(({ line, index }: { line: string; index: number }) => {
  // Helper function to format different types of terminal output with syntax highlighting
  const formatOutput = (text: string) => {
    // System messages and status updates
    if (
      text.startsWith("Initializing") ||
      text.startsWith("Loading") ||
      text.startsWith("Importing") ||
      text.startsWith("Configuring") ||
      text.startsWith("Starting") ||
      text.startsWith("Activating") ||
      text.startsWith("Environment") ||
      text.startsWith("System") ||
      text.startsWith("Successfully")
    ) {
      return <span className="text-green-400">{text}</span>
    }

    // Command prompts
    if (text.startsWith("$")) {
      return (
        <>
          <span className="text-green-400 mr-2">$</span>
          <span className="text-white ml-2">{text.substring(2)}</span>
        </>
      )
    }

    // Python code or output
    if (text.startsWith(">>>")) {
      return (
        <>
          <span className="text-blue-400 mr-2">{">>"}</span>
          <span className="text-cyan-300 ml-2">{text.substring(3)}</span>
        </>
      )
    }

    // Comments or documentation
    if (text.startsWith("#")) {
      return <span className="text-slate-400">{text}</span>
    }

    // Error messages
    if (text.includes("Error") || text.includes("Warning")) {
      return <span className="text-yellow-400">{text}</span>
    }

    // File paths or imports
    if (text.includes("/") || text.includes("import ")) {
      return <span className="text-cyan-300">{text}</span>
    }

    // JSON or dictionary-like output
    if ((text.includes("{") && text.includes("}")) || (text.includes("[") && text.includes("]"))) {
      return <span className="text-yellow-300">{text}</span>
    }

    // Model metrics or numerical results
    if (
      text.includes("accuracy") ||
      text.includes("precision") ||
      text.includes("recall") ||
      text.includes("f1-score")
    ) {
      return <span className="text-teal-300">{text}</span>
    }

    // Default formatting
    return <span className="text-slate-300 pl-4">{text}</span>
  }

  return formatOutput(line)
})

TerminalLine.displayName = "TerminalLine"

// Update the HeroTerminal component to match the skills terminal design while keeping typography
function HeroTerminal({
  onInitComplete,
}: {
  onInitComplete?: () => void
}) {
  const [commandText, setCommandText] = useState("")
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [hasStarted, setHasStarted] = useState(true) // Auto-start for hero section
  const terminalRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isHeroTerminalComplete } = useTerminal()

  // If terminal is already complete (from session storage), skip animation
  useEffect(() => {
    if (isHeroTerminalComplete && onInitComplete) {
      onInitComplete()
    }
  }, [isHeroTerminalComplete, onInitComplete])

  const fullCommand = heroTerminalCommand

  // Typing animation for command - slightly faster for better UX
  useEffect(() => {
    if (!hasStarted) return

    if (isTypingCommand && commandText.length < fullCommand.length) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(
        () => {
          setCommandText(fullCommand.slice(0, commandText.length + 1))
        },
        Math.random() * 30 + 30, // Faster typing speed for better UX
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
      }, 300) // Shorter pause after command is typed

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [commandText, isTypingCommand, hasStarted, fullCommand])

  // Find the line where terminalOutputs is defined and update it to call the function
  // Replace:
  // const terminalOutputs = heroTerminalOutputs
  const terminalOutputs = useRef(heroTerminalOutputs()).current

  // Output lines animation - optimized with requestAnimationFrame and faster timing
  useEffect(() => {
    // Only proceed if command typing is complete
    if (isTypingCommand) return

    if (currentLine < terminalOutputs.length) {
      const getNextLine = () => {
        const newLine = terminalOutputs[currentLine]
        setOutputLines((prev) => [...prev, newLine])
        setCurrentLine((prev) => prev + 1)

        // Check if this is the last line
        if (currentLine === terminalOutputs.length - 1 && onInitComplete) {
          // Add a small delay before triggering the callback
          setTimeout(() => {
            onInitComplete()
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

      // Calculate delay based on line content for more realistic typing
      let delay = 400 // Base delay

      // Faster for short lines, slower for commands and code
      const line = terminalOutputs[currentLine]
      if (line.startsWith("import") || line.startsWith("from")) {
        delay = 200 // Fast for imports
      } else if (line.startsWith("$") || line.startsWith(">>>")) {
        delay = 600 // Slower for commands
      } else if (line.includes("{") || line.includes("[")) {
        delay = 800 // Slower for data structures
      } else if (line.length < 30) {
        delay = 300 // Fast for short status messages
      }

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
  }, [isTypingCommand, currentLine, onInitComplete, terminalOutputs])

  // Ensure terminal scrolls to bottom whenever output lines change
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

  // Add this useEffect after the other useEffects
  useEffect(() => {
    // Ensure terminal always scrolls to bottom when new content is added
    if (terminalRef.current) {
      const scrollToBottom = () => {
        terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight
      }

      // Use both immediate and delayed scroll to ensure it works consistently
      scrollToBottom()
      setTimeout(scrollToBottom, 10)
    }
  }, [outputLines.length])

  // Method to add new commands to the terminal after initialization
  const handleAddCommand = (command: string, outputs: string[]) => {
    // Add the command to the output
    setOutputLines((prev) => [...prev, `$ ${command}`])

    // Add each output line with a delay
    let delay = 300
    outputs.forEach((line) => {
      setTimeout(() => {
        setOutputLines((prev) => [...prev, line])

        // Scroll to bottom of terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, delay)
      delay += Math.random() * 300 + 200 // Random delay between 200-500ms
    })

    return delay // Return the total delay for chaining
  }

  // Expose the addCommand method
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).terminalAddCommand = handleAddCommand
    }
  }, [])

  return (
    <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 font-mono text-sm mb-8 hero-terminal">
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
        <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
        <span className="ml-2 text-xs text-slate-400">nazmul@portfolio:~/projects</span>
      </div>
      <div className="terminal-content overflow-y-auto h-[240px]" ref={terminalRef}>
        <div className="flex items-start mb-1">
          <span className="text-green-400 mr-2">$</span>
          <span className="text-white ml-2">{commandText}</span>
          {isTypingCommand && hasStarted && (
            <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle terminal-cursor"></span>
          )}
        </div>

        {outputLines.map((line, index) => (
          <div
            key={index}
            className="flex items-start mb-1 terminal-line"
            style={{
              opacity: 1,
              transform: "none",
              animation: "none",
            }}
          >
            <TerminalLine line={line} index={index} />
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

export default memo(HeroTerminal)
