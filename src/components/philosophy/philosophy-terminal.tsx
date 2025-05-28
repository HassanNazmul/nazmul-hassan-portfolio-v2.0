"use client"

import { useState, useEffect, useRef, memo } from "react"
import {
  philosophyTerminalCommand,
  philosophyTerminalOutputs,
  philosophyCommandsToType,
} from "@/data/terminal-messages/philosophy"

function PhilosophyTerminal() {
  const [commandText, setCommandText] = useState("")
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add these new state variables after the existing ones
  const [currentCommand, setCurrentCommand] = useState("")
  const [isTypingSubCommand, setIsTypingSubCommand] = useState(false)
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1)
  const [commandsToType, setCommandsToType] = useState<string[]>(philosophyCommandsToType)

  const currentDate = new Date()
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/,/g, "")

  // Memoize terminal outputs to prevent recreation
  const terminalOutputs = useRef(philosophyTerminalOutputs).current

  const fullCommand = philosophyTerminalCommand

  // Set up cursor blinking
  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current)
      }
    }
  }, [])

  // Set up intersection observer to detect when terminal is in view
  useEffect(() => {
    if (observerRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Set isInView state based on intersection
        setIsInView(entry.isIntersecting)

        // If terminal comes into view and hasn't started yet, mark it as started
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      {
        root: null, // viewport
        threshold: 0.5, // trigger when 50% of the element is visible
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

    let typingTimer: number

    if (isTypingCommand && commandText.length < fullCommand.length) {
      typingTimer = window.setTimeout(
        () => {
          setCommandText(fullCommand.slice(0, commandText.length + 1))
        },
        Math.random() * 70 + 80, // Slightly slower, more noticeable typing speed
      )

      return () => window.clearTimeout(typingTimer)
    } else if (isTypingCommand && commandText.length === fullCommand.length) {
      typingTimer = window.setTimeout(() => {
        setIsTypingCommand(false)
      }, 800) // Longer pause after command is typed for better effect

      return () => window.clearTimeout(typingTimer)
    }
  }, [commandText, isTypingCommand, hasStarted, fullCommand])

  // Output lines animation - optimized with requestAnimationFrame
  useEffect(() => {
    // Only proceed if terminal has started and command typing is complete
    if (!hasStarted || isTypingCommand || isTypingSubCommand) return

    if (currentLine < terminalOutputs.length) {
      const currentLineText = terminalOutputs[currentLine]

      // Skip command lines as they will be handled by the command typing effect
      if (
        currentLineText.startsWith("cat") ||
        currentLineText.startsWith("ls") ||
        currentLineText.startsWith("echo") ||
        currentLineText.startsWith("cd") ||
        currentLineText.startsWith("python") ||
        currentLineText.startsWith("clear")
      ) {
        // Don't add the command yet, let the typing effect handle it
        return
      }

      const getNextLine = () => {
        const newLine = terminalOutputs[currentLine]
        setOutputLines((prev) => [...prev, newLine])
        setCurrentLine((prev) => prev + 1)

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
        terminalOutputs[currentLine].startsWith("#") ||
        terminalOutputs[currentLine].startsWith("===") ||
        terminalOutputs[currentLine].startsWith("---")
          ? 800 // Slower for headers and separators
          : terminalOutputs[currentLine] === ""
            ? 300 // Medium for empty lines
            : 150 // Fast for regular text

      const timer = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(getNextLine)
      }, delay)

      return () => {
        clearTimeout(timer)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isTypingCommand, isTypingSubCommand, currentLine, hasStarted, terminalOutputs])

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

  // Add this new useEffect after the other useEffects
  useEffect(() => {
    // Only start typing sub-commands after the initial command is done
    if (isTypingCommand || !hasStarted) return

    // Find the next command to type in the output
    const findNextCommand = () => {
      const nextIndex = currentLine
      if (nextIndex < terminalOutputs.length) {
        const line = terminalOutputs[nextIndex]
        if (
          line.startsWith("cat") ||
          line.startsWith("ls") ||
          line.startsWith("echo") ||
          line.startsWith("cd") ||
          line.startsWith("python") ||
          line.startsWith("clear")
        ) {
          // Found a command, start typing it
          const commandIndex = commandsToType.indexOf(line)
          if (commandIndex !== -1) {
            setCurrentCommandIndex(commandIndex)
            setCurrentCommand("")
            setIsTypingSubCommand(true)
            return true
          }
        }
      }
      return false
    }

    // If we're not currently typing a sub-command, check if we need to start
    if (!isTypingSubCommand) {
      if (findNextCommand()) {
        // We found a command to type
        return
      }
    } else {
      // We're currently typing a sub-command
      const fullSubCommand = commandsToType[currentCommandIndex]

      if (currentCommand.length < fullSubCommand.length) {
        // Continue typing the current sub-command
        const typingTimer = setTimeout(
          () => {
            setCurrentCommand(fullSubCommand.slice(0, currentCommand.length + 1))
          },
          Math.random() * 70 + 80,
        )

        return () => clearTimeout(typingTimer)
      } else {
        // Finished typing this sub-command
        const pauseTimer = setTimeout(() => {
          setIsTypingSubCommand(false)
          // Add the completed command to output lines
          setOutputLines((prev) => [...prev, commandsToType[currentCommandIndex]])
          setCurrentLine((prev) => prev + 1)
        }, 500)

        return () => clearTimeout(pauseTimer)
      }
    }
  }, [
    isTypingCommand,
    hasStarted,
    isTypingSubCommand,
    currentCommand,
    currentCommandIndex,
    commandsToType,
    currentLine,
    terminalOutputs,
  ])

  // Update the formatFileListing function to handle command typing with cursor
  const formatFileListing = (text: string) => {
    // Commands with typing effect
    if (
      text.startsWith("cat") ||
      text.startsWith("ls") ||
      text.startsWith("echo") ||
      text.startsWith("cd") ||
      text.startsWith("python") ||
      text.startsWith("clear")
    ) {
      // Check if this is the current command being typed
      if (commandsToType.includes(text) && text === commandsToType[currentCommandIndex] && isTypingSubCommand) {
        return (
          <>
            <span className="text-green-400 mr-2">$</span>
            <span className="text-white ml-2">{currentCommand}</span>
            {cursorVisible && <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>}
          </>
        )
      }

      return (
        <>
          <span className="text-green-400 mr-2">$</span>
          <span className="text-white ml-2">{text}</span>
        </>
      )
    }

    // Headers with # symbol
    if (text.startsWith("#")) {
      return <span className="text-cyan-400 font-bold">{text}</span>
    }

    // File listings
    if (text.match(/^drwx|^-rw/) || text.startsWith("total")) {
      const parts = text.split(/\s+/)
      const permissions = parts[0]
      const fileName = parts[parts.length - 1]
      const middle = parts.slice(1, -1).join(" ")

      return (
        <>
          <span className="file-permission">{permissions}</span>
          <span className="text-slate-300"> {middle} </span>
          <span className="file-name">{fileName}</span>
        </>
      )
    }

    // Separator lines
    if (text.startsWith("===") || text.startsWith("---")) {
      return <span className="text-blue-400">{text}</span>
    }

    // Bullet points
    if (text.startsWith("•")) {
      return <span className="text-green-300">{text}</span>
    }

    // Quotes
    if (text.startsWith('"')) {
      return <span className="text-yellow-300 italic">{text}</span>
    }

    // Loading or success messages
    if (text.includes("Loading") || text.includes("loaded successfully")) {
      return <span className="text-green-400">{text}</span>
    }

    // Default text
    return <span className="text-slate-300">{text}</span>
  }

  return (
    <div
      className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 font-mono text-sm mb-8 mx-auto max-w-3xl philosophy-terminal"
      ref={containerRef}
    >
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
        <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
        <span className="ml-2 text-xs text-slate-400">philosophy@nazmul:~</span>
      </div>
      <div className="terminal-content overflow-y-auto h-[300px]" ref={terminalRef}>
        <div className="flex items-start mb-1">
          <span className="text-green-400 mr-2">$</span>
          <div className="typing-command">
            <span className="text-white ml-2">{commandText}</span>
            {isTypingCommand && hasStarted && cursorVisible && (
              <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>
            )}
          </div>
        </div>

        {outputLines.map((line, index) => (
          <div key={index} className="flex items-start mb-1">
            <span className="text-slate-300 pl-4">{formatFileListing(line)}</span>
          </div>
        ))}

        {/* Show the command being typed if applicable */}
        {isTypingSubCommand && (
          <div className="flex items-start mb-1">
            <span className="text-green-400 mr-2">$</span>
            <span className="text-white ml-2">{currentCommand}</span>
            {cursorVisible && <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>}
          </div>
        )}

        {!isTypingCommand && currentLine === terminalOutputs.length && hasStarted && (
          <div className="flex items-start mb-1">
            <span className="text-green-400 mr-2">$</span>
            {cursorVisible && <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(PhilosophyTerminal)
