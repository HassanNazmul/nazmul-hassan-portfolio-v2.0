import Link from "next/link"
import { Github, Linkedin, Mail, Code, Terminal } from "lucide-react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <MatrixGrid className="py-12 border-t border-zinc-800" color="blue" intensity="light">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="#home" className="text-xl font-orbitron tracking-wider">
              <span className="flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-cyan-500" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                  Nazmul Hassan
                </span>
              </span>
            </Link>
            <p className="text-slate-400 mt-2 max-w-md font-mono">
              Machine Learning Engineer, AI Specialist, Data Scientist, and Backend Developer.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/nazmulhassan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/nazmulhassan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:nazmul.hassan@example.com"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://hackerrank.com/nazmulhassan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="HackerRank"
            >
              <Code className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-500 text-sm font-mono">© {currentYear} Nazmul Hassan. All rights reserved.</div>

          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap space-x-4 text-sm text-slate-500 font-mono">
              <li>
                <Link href="#home" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#skills" className="hover:text-white transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-white transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MatrixGrid>
  )
}
