import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const ParticlesFlow = () => {
  const particleCount = 5000 // More particles for a scattered effect
  const circleParticles = useLoader(TextureLoader, '/circle_05.png')
  // Memoize initial particle positions and velocities
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3) // X, Y, Z for each particle
    const velocities = new Float32Array(particleCount * 3) // X, Y, Z for velocity

    for (let i = 0; i < particleCount; i++) {
      // Random initial positions scattered around the scene
      positions[i * 3] = (Math.random() - 0.5) * 50 // X position spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 // Y position spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 // Z position spread

      // Set initial velocities for a subtle upward and rightward wind effect
      velocities[i * 3] = 0.01 + Math.random() * 0.01 // X-axis drift (rightward)
      velocities[i * 3 + 1] = 0.02 + Math.random() * 0.02 // Y-axis drift (upward)
      velocities[i * 3 + 2] = Math.random() * 0.01 // Z-axis drift
    }
    return { positions, velocities }
  }, [particleCount])

  // Animate particles to flow in a wind direction
  useFrame(() => {
    const { positions, velocities } = particles
    for (let i = 0; i < particleCount; i++) {
      // Update position based on velocity for wind-like drift
      positions[i * 3] += velocities[i * 3] // X-axis
      positions[i * 3 + 1] += velocities[i * 3 + 1] // Y-axis
      positions[i * 3 + 2] += velocities[i * 3 + 2] // Z-axis

      // Reset particles when they move out of bounds for continuous flow
      if (
        positions[i * 3 + 1] > 10 ||
        positions[i * 3] > 15 ||
        positions[i * 3 + 2] > 15
      ) {
        positions[i * 3] = (Math.random() - 0.5) * 30
        positions[i * 3 + 1] = -10 // Start from below for upward flow
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30
      }
    }
  })

  return (
    <Points positions={particles.positions} stride={3}>
      <PointMaterial
        transparent
        color="#FF4500" // Fiery orange color
        size={0.04} // Particle size for sparks
        sizeAttenuation
        depthWrite={false} // To make particles glow-like
        alphaMap={circleParticles}
      />
    </Points>
  )
}

export default ParticlesFlow
