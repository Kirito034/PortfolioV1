"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

// Create a custom shader material for the terrain
const TerrainShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uScrollProgress: 0,
    uColorA: new THREE.Color(0x050505),
    uColorB: new THREE.Color(0x1a1a1a),
    uColorC: new THREE.Color(0x333333),
    uNoiseFrequency: 1.5,
    uNoiseAmplitude: 0.2,
    uWireframe: 0.0,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uNoiseFrequency;
    uniform float uNoiseAmplitude;
    
    varying vec2 vUv;
    varying float vElevation;
    
    // Classic Perlin 3D Noise by Stefan Gustavson
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    
    float cnoise(vec3 P) {
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
    
      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
      vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
      vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
      vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
      vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
      vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
      vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
      vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
      vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
    
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
    
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
    
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }
    
    void main() {
      vUv = uv;
      
      // Calculate multiple layers of noise
      float noise1 = cnoise(vec3(position.x * uNoiseFrequency, position.y * uNoiseFrequency, uTime * 0.1)) * uNoiseAmplitude;
      float noise2 = cnoise(vec3(position.x * uNoiseFrequency * 2.0, position.y * uNoiseFrequency * 2.0, uTime * 0.15)) * uNoiseAmplitude * 0.5;
      float noise3 = cnoise(vec3(position.x * uNoiseFrequency * 4.0, position.y * uNoiseFrequency * 4.0, uTime * 0.2)) * uNoiseAmplitude * 0.25;
      
      // Combine noise layers
      float elevation = noise1 + noise2 + noise3;
      
      // Apply scroll effect - terrain rises as user scrolls
      elevation *= 1.0 + uScrollProgress * 2.0;
      
      // Store elevation for fragment shader
      vElevation = elevation;
      
      // Apply elevation to vertex
      vec3 newPosition = position;
      newPosition.z += elevation;
      
      // Apply scroll effect to position
      newPosition.y -= uScrollProgress * 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uWireframe;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Create grid lines effect
      float gridX = abs(fract(vUv.x * 20.0 - 0.5) - 0.5) / 0.5;
      float gridY = abs(fract(vUv.y * 20.0 - 0.5) - 0.5) / 0.5;
      
      // Thinner lines
      gridX = smoothstep(0.95, 1.0, gridX);
      gridY = smoothstep(0.95, 1.0, gridY);
      
      // Combine grid lines
      float grid = clamp(gridX + gridY, 0.0, 1.0);
      
      // Elevation-based color
      vec3 baseColor = mix(uColorA, uColorB, vElevation * 2.0 + 0.5);
      
      // Add highlights based on elevation
      baseColor = mix(baseColor, uColorC, smoothstep(0.1, 0.3, vElevation));
      
      // Add scroll-based color shift
      baseColor = mix(baseColor, vec3(0.1, 0.1, 0.2), uScrollProgress * 0.3);
      
      // Add grid lines
      vec3 finalColor = mix(baseColor, vec3(1.0), grid * 0.15);
      
      // Add wireframe effect based on uniform
      finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), uWireframe * grid);
      
      // Add subtle pulsing glow
      float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
      finalColor += vec3(0.05, 0.05, 0.1) * pulse * (1.0 - uScrollProgress);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
)

// Extend Three.js with our custom shader
extend({ TerrainShaderMaterial })

export function ShaderScene({ scrollProgress = 0 }) {
  const terrainRef = useRef()
  const materialRef = useRef()

  // Update shader uniforms on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
      materialRef.current.uScrollProgress = scrollProgress

      // Increase wireframe effect as user scrolls
      materialRef.current.uWireframe = scrollProgress * 0.5

      // Adjust noise parameters based on scroll
      materialRef.current.uNoiseFrequency = 1.5 + scrollProgress * 0.5
      materialRef.current.uNoiseAmplitude = 0.2 + scrollProgress * 0.3
    }
  })

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.2} />

      {/* Directional light */}
      <directionalLight position={[1, 1, 1]} intensity={0.5} />

      {/* Terrain mesh */}
      <mesh ref={terrainRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1, -2]} scale={[4, 4, 1]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <terrainShaderMaterial ref={materialRef} />
      </mesh>

      {/* Additional terrain layers for depth */}
      <mesh rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -4]} scale={[8, 8, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <terrainShaderMaterial
          uNoiseFrequency={0.8}
          uNoiseAmplitude={0.4}
          uColorA={new THREE.Color(0x020202)}
          uColorB={new THREE.Color(0x0a0a0a)}
          uColorC={new THREE.Color(0x222222)}
        />
      </mesh>

      {/* Background layer */}
      <mesh rotation={[-Math.PI / 3, 0, 0]} position={[0, -4, -8]} scale={[16, 16, 1]}>
        <planeGeometry args={[1, 1, 16, 16]} />
        <terrainShaderMaterial
          uNoiseFrequency={0.4}
          uNoiseAmplitude={0.6}
          uColorA={new THREE.Color(0x000000)}
          uColorB={new THREE.Color(0x050505)}
          uColorC={new THREE.Color(0x111111)}
        />
      </mesh>
    </>
  )
}

