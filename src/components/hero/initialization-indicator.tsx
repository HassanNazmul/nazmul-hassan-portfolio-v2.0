"use client"

import { memo } from "react"
import { Loader } from "lucide-react"

function InitializationIndicator() {
  return (
    <div className="initialization-indicator">
      <div className="flex flex-col items-center">
        <Loader className="h-6 w-6 text-cyan-400 animate-spin" />
        <span className="text-sm text-slate-400 mt-2 font-mono">Initializing Developer Environment...</span>
        <div className="progress-bar mt-3">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  )
}

export default memo(InitializationIndicator)
