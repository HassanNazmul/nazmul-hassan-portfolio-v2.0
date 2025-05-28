"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type TerminalContextType = {
  isHeroTerminalComplete: boolean
  setHeroTerminalComplete: (value: boolean) => void
  isNavbarLocked: boolean
}

const defaultContextValue: TerminalContextType = {
  isHeroTerminalComplete: false,
  setHeroTerminalComplete: () => {},
  isNavbarLocked: true,
}

const TerminalContext = createContext<TerminalContextType>(defaultContextValue)

export const useTerminal = () => useContext(TerminalContext)

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [isHeroTerminalComplete, setHeroTerminalComplete] = useState(false)

  // Derive navbar locked state from hero terminal state
  const isNavbarLocked = !isHeroTerminalComplete

  // Check sessionStorage on initial load to persist state across page refreshes
  useEffect(() => {
    const storedState = sessionStorage.getItem("heroTerminalComplete")
    if (storedState === "true") {
      setHeroTerminalComplete(true)
    }
  }, [])

  // Update sessionStorage when terminal state changes
  useEffect(() => {
    sessionStorage.setItem("heroTerminalComplete", isHeroTerminalComplete.toString())
  }, [isHeroTerminalComplete])

  return (
    <TerminalContext.Provider
      value={{
        isHeroTerminalComplete,
        setHeroTerminalComplete,
        isNavbarLocked,
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}
