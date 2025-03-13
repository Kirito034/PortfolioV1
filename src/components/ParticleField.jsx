"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ParticleField() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const particlesRef = useRef(null)
  const animationFrameRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particles
    const particleCount = 1500
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Position - create a more layered depth effect
      const distance = Math.random() * 10
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)

      positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi)
      positions[i * 3 + 2] = distance * Math.cos(theta)

      // Color - create a subtle color gradient
      const colorFactor = Math.random()
      colors[i * 3] = 0.8 + colorFactor * 0.2 // R
      colors[i * 3 + 1] = 0.8 + colorFactor * 0.2 // G
      colors[i * 3 + 2] = 0.9 + colorFactor * 0.1 // B - slightly bluer

      // Size - vary the sizes more
      sizes[i] = Math.random() * 0.05 + 0.01

      // Speed - for animation
      speeds[i] = Math.random() * 0.01 + 0.002
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Store speeds for animation
    particles.userData = { speeds }

    // Create particle material with custom shader
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    })

    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial)
    scene.add(particleSystem)
    particlesRef.current = particleSystem

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Handle scroll
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
    }
    window.addEventListener("scroll", handleScroll)

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      if (!particlesRef.current) return

      const time = Date.now() * 0.0005
      const positions = particleSystem.geometry.attributes.position.array
      const speeds = particleSystem.geometry.userData.speeds

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Create wave-like motion
        positions[i3 + 1] += Math.sin(time + positions[i3] * 0.1) * speeds[i] * 2

        // Reset particles that go too far
        if (positions[i3 + 1] > 5) positions[i3 + 1] = -5
        if (positions[i3 + 1] < -5) positions[i3 + 1] = 5
      }

      particleSystem.geometry.attributes.position.needsUpdate = true

      // Rotate based on mouse and scroll
      particleSystem.rotation.x = mouseRef.current.y * 0.2 + scrollRef.current * 0.5
      particleSystem.rotation.y = mouseRef.current.x * 0.2 + time * 0.1

      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      particles.dispose()
      particleMaterial.dispose()
    }
  }, [])

  return <div ref={containerRef} className="particle-field"></div>
}

