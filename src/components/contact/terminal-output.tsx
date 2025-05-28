interface TerminalOutputProps {
  lines: string[]
}

export default function TerminalOutput({ lines }: TerminalOutputProps) {
  return (
    <div className="terminal-window mb-4">
      <div className="terminal-header">
        <div className="terminal-button bg-red-500"></div>
        <div className="terminal-button bg-yellow-500"></div>
        <div className="terminal-button bg-green-500"></div>
        <span className="ml-2 text-xs text-slate-400">message@nazmul:~</span>
      </div>
      <div className="terminal-content">
        {lines.map((line, index) => (
          <div key={index} className="terminal-line" style={{ animationDelay: `${index * 0.3}s` }}>
            <span className="terminal-prompt">$</span>
            <span className="terminal-command ml-2">{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
