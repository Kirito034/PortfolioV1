"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// Function to create animated floating particles
function FloatingParticles() {
  useEffect(() => {
    const container = document.querySelector(".particle-container")
    if (!container) return

    for (let i = 0; i < 100; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.top = `${Math.random() * 100}%`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDuration = `${Math.random() * 3 + 2}s`
      particle.style.width = `${Math.random() * 3 + 1}px`
      particle.style.height = `${Math.random() * 3 + 1}px`
      particle.style.opacity = `${Math.random() * 0.5 + 0.3}`
      container.appendChild(particle)
    }

    return () => {
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }
    }
  }, [])

  return <div className="particle-container"></div>
}

export default function HeroSection({ onPageChange }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Apply parallax effect to image
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.transform = `perspective(1000px) rotateY(${mousePosition.x * 0.05}deg) rotateX(${-mousePosition.y * 0.05}deg) translateZ(10px)`
    }
  }, [mousePosition])

  return (
    <section className="hero-section">
      <FloatingParticles />
      <div className="content-wrapper">
        <div className="hero-content">
          <div className="hero-text-container">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title"
            >
              Amanpreet Singh Ossan
            </motion.h1>
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-subtitle"
            >
              Full Stack Developer
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-description"
            >
                                "I am a full-stack developer and data scientist,
                    Crafting intelligence with code, precise and efficient.
                    Driven by the art of scalable, optimized creation,
                    A craftsman shaping solutions with innovation."
            </motion.p>
          </div>

          <motion.div
            className="hero-image-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="image-wrapper" ref={imageRef}>
              <div className="image-glow"></div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ieee%20img.jpg-04w8kcdYGUqMDYa4COlwpeqZtp61Oy.jpeg"
                alt="Amanpreet Singh - Full Stack Developer"
                width="300"
                height="300"
                className="profile-image"
              />
              <div className="image-backdrop"></div>
              <div className="image-reflection"></div>
            </div>
          </motion.div>

          <motion.div
            className="cta-buttons"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="primary-btn" onClick={() => onPageChange("projects")}>
              View Projects
            </button>
            <button className="secondary-btn" onClick={() => onPageChange("contact")}>
              Contact Me
            </button>
          </motion.div>

          <div className="scroll-indicator-container">
            <motion.div
              className="scroll-indicator"
              animate={{
                y: [0, 10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
              }}
            >
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

