"use client"

import { useState, useEffect, useRef, memo } from "react"

interface TypewriterTextProps {
  roles: string[]
}

function TypewriterText({ roles }: TypewriterTextProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed] = useState(100)
  const typingDelayRef = useRef<NodeJS.Timeout | null>(null)

  // Effect to handle the typing animation
  useEffect(() => {
    const currentRole = roles[currentRoleIndex]

    // Calculate the typing speed based on whether we're typing or deleting
    const speed = isDeleting
      ? typingSpeed / 2 // Faster when deleting
      : currentText.length === 0
        ? 500 // Pause before starting a new word
        : typingSpeed

    if (typingDelayRef.current) {
      clearTimeout(typingDelayRef.current)
    }

    typingDelayRef.current = setTimeout(() => {
      // If we're not deleting and haven't completed the word
      if (!isDeleting && currentText !== currentRole) {
        setCurrentText(currentRole.substring(0, currentText.length + 1))
      }
      // If we're not deleting and have completed the word
      else if (!isDeleting && currentText === currentRole) {
        // Pause at the end of the word before starting to delete
        setTimeout(() => {
          setIsDeleting(true)
        }, 2000)
      }
      // If we're deleting and haven't deleted the whole word
      else if (isDeleting && currentText !== "") {
        setCurrentText(currentRole.substring(0, currentText.length - 1))
      }
      // If we're deleting and have deleted the whole word
      else if (isDeleting && currentText === "") {
        setIsDeleting(false)
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length)
      }
    }, speed)

    return () => {
      if (typingDelayRef.current) {
        clearTimeout(typingDelayRef.current)
      }
    }
  }, [currentText, isDeleting, currentRoleIndex, roles, typingSpeed])

  return (
    <div className="min-h-[2.5rem] flex items-center">
      <h2 className="text-xl sm:text-2xl text-slate-400 leading-relaxed font-mono flex items-center">
        <span className="text-cyan-400 mr-2">&gt;</span>
        <span className="inline-block whitespace-nowrap m-0 text-slate-300">{currentText}</span>
        <span
          className={`inline-block w-[3px] h-[1.2em] ${isDeleting ? "bg-red-500" : "bg-cyan-400"} ml-[2px] align-middle animate-[blink_1s_step-end_infinite]`}
        ></span>
      </h2>
    </div>
  )
}

export default memo(TypewriterText)
