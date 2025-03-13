"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useScroll, Stars, Text } from "@react-three/drei"
import * as THREE from "three"

// 3D Scene Component with scroll interaction
export function Scene3D({ scrollY }) {
  const { size, camera } = useThree()
  const scroll = useScroll()
  const group = useRef()
  const textRef = useRef()

  // Create objects for the 3D scene
  const objects = useRef([])

  useEffect(() => {
    // Create random objects for the scene
    objects.current = Array(20)
      .fill()
      .map(() => ({
        position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 5],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.5 + 0.5,
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
      }))
  }, [])

  // Use the frame loop to animate based on scroll
  useFrame((state, delta) => {
    // Calculate scroll progress (0 to 1)
    const scrollOffset = scroll.offset || scrollY / (document.body.scrollHeight - window.innerHeight) || 0

    // Rotate the entire group based on scroll
    if (group.current) {
      group.current.rotation.y = scrollOffset * Math.PI * 2
      group.current.rotation.x = scrollOffset * Math.PI * 0.5

      // Move camera based on scroll
      camera.position.z = 5 + scrollOffset * 5
      camera.position.y = scrollOffset * 2
      camera.lookAt(0, 0, 0)
    }

    // Animate individual objects
    group.current.children.forEach((mesh, i) => {
      if (mesh.type === "Mesh") {
        mesh.rotation.x += delta * 0.1 * (i % 2 ? 1 : -1)
        mesh.rotation.z += delta * 0.1 * (i % 2 ? 1 : -1)

        // Pulse effect based on scroll
        const pulseScale = 1 + Math.sin(scrollOffset * Math.PI * 4 + i) * 0.1
        mesh.scale.set(
          objects.current[i].scale * pulseScale,
          objects.current[i].scale * pulseScale,
          objects.current[i].scale * pulseScale,
        )
      }
    })

    // Animate text
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
      textRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <>
      {/* Ambient light for the scene */}
      <ambientLight intensity={0.2} />

      {/* Directional light to create shadows */}
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#ffffff" />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Main group that will be animated */}
      <group ref={group}>
        {/* 3D text that floats in space */}
        <Text
          ref={textRef}
          position={[0, 0, -2]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter_Regular.json"
        >
          Scroll to Explore
        </Text>

        {/* Generate random geometric objects */}
        {objects.current.map((props, i) => (
          <mesh key={i} position={props.position} rotation={props.rotation}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={props.color} wireframe={i % 3 === 0} />
          </mesh>
        ))}
      </group>
    </>
  )
}

