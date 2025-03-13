"use client"

import { useState, useEffect, useRef } from "react"
import "./App.css"
import "./styles/hero.css"
import "./styles/transitions.css"
import "./styles/sections.css"
import "./styles/welcome.css"
import { projects, skills, experiences } from "./data/portfolioData"
import ShaderBackground from "./components/ShaderBackground"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import ParticleField from "./components/ParticleField"
import WelcomeSequence from "./components/WelcomeSequence"
import { AboutSection, ProjectsSection, ContactSection } from "./components/Sections"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const appRef = useRef(null)

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Show initial black screen, then welcome sequence
  useEffect(() => {
    // Show black screen for 1 second before welcome sequence
    const initialTimer = setTimeout(() => {
      setInitialLoading(false)
    }, 1000)

    return () => clearTimeout(initialTimer)
  }, [])

  // Handle welcome sequence dismissal
  const handleWelcomeComplete = () => {
    setShowWelcome(false)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setMenuOpen(false)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Calculate scroll progress for shader animations
  const scrollProgress = Math.min(1, scrollY / (document.body.scrollHeight - window.innerHeight || 1))

  return (
    <div className={`app ${initialLoading ? "initial-loading" : ""}`} ref={appRef} data-page={currentPage}>
      {/* Initial Loading Screen */}
      {initialLoading && <div className="initial-loading-screen"></div>}

      {/* Welcome Sequence */}
      {!initialLoading && showWelcome && <WelcomeSequence onComplete={handleWelcomeComplete} />}

      {/* Main Content - Only show when welcome sequence is complete */}
      {(!showWelcome || !initialLoading) && (
        <>
          {/* Shader Background */}
          <ShaderBackground scrollProgress={scrollProgress} />

          {/* Particle Field */}
          <ParticleField />

          {/* Navbar */}
          <Navbar
            currentPage={currentPage}
            onPageChange={handlePageChange}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />

          {/* Content Section */}
          <div className="content-container">
            {currentPage === "home" && <HeroSection onPageChange={handlePageChange} />}
            {currentPage === "about" && <AboutSection experiences={experiences} skills={skills} />}
            {currentPage === "projects" && <ProjectsSection projects={projects} />}
            {currentPage === "contact" && <ContactSection />}
          </div>

          <Footer />
        </>
      )}
    </div>
  )
}

export default App

