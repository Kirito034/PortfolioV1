"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uResolution;
  
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
  
  // Function to create grid lines
  float grid(vec2 uv, float size) {
    vec2 grid = abs(fract(uv * size - 0.5) - 0.5) / fract(1.0 / size);
    return min(grid.x, grid.y);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    // Adjust UV for aspect ratio
    uv.x *= uResolution.x / uResolution.y;
    
    // Create multiple layers of noise
    float time = uTime * 0.1;
    
    // Base mountain layer
    float mountainScale = 2.0 + uScrollProgress * 1.0;
    float mountainSpeed = time * 0.2;
    float mountain = cnoise(vec3(uv.x * mountainScale, uv.y * mountainScale, mountainSpeed)) * 0.5 + 0.5;
    
    // Add detail to mountains
    float detail = cnoise(vec3(uv.x * 5.0, uv.y * 5.0, time * 0.5)) * 0.2;
    mountain += detail * (0.5 + uScrollProgress * 0.5);
    
    // Create horizon line
    float horizon = smoothstep(0.4, 0.6, uv.y);
    
    // Grid lines
    float gridSize = 20.0 + uScrollProgress * 30.0;
    float gridLines = smoothstep(0.95, 1.0, grid(uv, gridSize));
    
    // Smaller detail grid
    float detailGrid = smoothstep(0.95, 1.0, grid(uv, gridSize * 2.0)) * 0.5;
    
    // Combine grids
    float finalGrid = gridLines + detailGrid;
    
    // Mountain silhouette
    float mountainMask = smoothstep(0.3, 0.31, mountain - uv.y * 0.8);
    
    // Scroll effect on mountains
    mountainMask = mix(mountainMask, smoothstep(0.4, 0.41, mountain - uv.y * 0.7), uScrollProgress);
    
    // Add glow to horizon
    float horizonGlow = smoothstep(0.5, 0.0, abs(uv.y - 0.5)) * 0.2;
    
    // Add glow to mountains
    float mountainGlow = smoothstep(1.0, 0.0, abs(mountain - uv.y * 0.8) * 10.0) * 0.1;
    
    // Combine all effects
    vec3 color = vec3(0.0);
    
    // Add grid to background
    color += finalGrid * 0.15;
    
    // Add mountain silhouette
    color = mix(color, vec3(0.2, 0.2, 0.3), mountainMask);
    
    // Add glows
    color += horizonGlow * vec3(0.1, 0.1, 0.3);
    color += mountainGlow * vec3(0.2, 0.2, 0.4);
    
    // Add subtle color variation based on scroll
    color = mix(color, vec3(0.1, 0.1, 0.2), uScrollProgress * 0.3);
    
    // Add pulsing effect
    float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
    color += vec3(0.05, 0.05, 0.1) * pulse * (1.0 - uScrollProgress);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

export default function ShaderBackground({ scrollProgress = 0 }) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const materialRef = useRef(null)
  const animationFrameRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera (orthographic for full-screen quad)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create full-screen quad
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: scrollProgress },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
    })
    materialRef.current = material

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      if (!materialRef.current) return

      const elapsedTime = (Date.now() - startTimeRef.current) / 1000
      materialRef.current.uniforms.uTime.value = elapsedTime

      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      geometry.dispose()
      material.dispose()
    }
  }, [scrollProgress])

  // Update scroll progress
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress
    }
  }, [scrollProgress])

  return (
    <>
      <div ref={containerRef} className="shader-background"></div>
      <div className="fallback-background"></div>
    </>
  )
}

