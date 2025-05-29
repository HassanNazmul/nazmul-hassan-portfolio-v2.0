"use client"

import { useState, useRef, useEffect } from "react"
import MatrixGrid from "@/components/ux-ui/matrix-grid"
import ContactForm from "./contact-form"
import ContactInfo from "./contact-info"
import "./contact-styles.css"

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const currentRef = sectionRef.current; // Capture the current ref value

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) { // Use the captured value in cleanup
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <MatrixGrid className="py-20" id="contact" color="green">
      <div className="text-center mb-16">
        <h2 className="section-title">Get In Touch</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-mono">
          Have a project in mind or want to collaborate? Feel free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          ref={sectionRef as React.RefObject<HTMLDivElement>}
        >
          <ContactInfo />
        </div>

        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          <ContactForm />
        </div>
      </div>
    </MatrixGrid>
  )
}
