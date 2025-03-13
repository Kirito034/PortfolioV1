"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function PageTransition({ children, currentPage }) {
  const [direction, setDirection] = useState(1)
  const [prevPage, setPrevPage] = useState(currentPage)

  useEffect(() => {
    // Determine direction based on page order
    const pageOrder = ["home", "about", "projects", "contact"]
    const prevIndex = pageOrder.indexOf(prevPage)
    const currentIndex = pageOrder.indexOf(currentPage)
    setDirection(currentIndex > prevIndex ? 1 : -1)
    setPrevPage(currentPage)
  }, [currentPage, prevPage])

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -45 : 45,
      transition: {
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="page-transition-container">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="page-content"
          style={{ perspective: "1000px" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

