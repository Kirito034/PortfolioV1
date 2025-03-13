"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../styles/welcome.css"

export default function WelcomeSequence({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isBlurred, setIsBlurred] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    // Make the welcome sequence interactive after 2 seconds
    const interactiveTimer = setTimeout(() => {
      setIsInteractive(true)
    }, 2000)

    // Auto-dismiss after 15 seconds if user doesn't interact
    const autoDismissTimer = setTimeout(() => {
      handleDismiss()
    }, 15000)

    return () => {
      clearTimeout(interactiveTimer)
      clearTimeout(autoDismissTimer)
    }
  }, [])

  const handleDismiss = () => {
    // Start the exit animation sequence
    setIsBlurred(true)

    setTimeout(() => {
      setIsFading(true)
    }, 500)

    setTimeout(() => {
      setIsVisible(false)
      // Call the parent component's callback
      if (onComplete) onComplete()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`welcome-sequence ${isBlurred ? "blurred" : ""} ${isFading ? "fading" : ""} ${isInteractive ? "interactive" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={isInteractive ? handleDismiss : undefined}
        >
          <div className="welcome-content">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to Amanpreet's Portfolio
            </motion.h1>
            <motion.div
              className="welcome-line"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Crafting intelligent solutions with code
            </motion.p>

            {isInteractive && (
              <motion.div
                className="welcome-cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p>Click anywhere to continue</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

