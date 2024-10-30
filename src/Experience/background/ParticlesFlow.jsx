import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const ParticlesFlow = () => {
  const particleCount = 5000
  const circleParticles = useLoader(TextureLoader, '/textures/circle_05.png')

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      velocities[i * 3] = 0.01 + Math.random() * 0.01
      velocities[i * 3 + 1] = 0.02 + Math.random() * 0.02
      velocities[i * 3 + 2] = Math.random() * 0.01
    }
    return { positions, velocities }
  }, [particleCount])

  useFrame(() => {
    const { positions, velocities } = particles
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      if (
        positions[i * 3 + 1] > 10 ||
        positions[i * 3] > 15 ||
        positions[i * 3 + 2] > 15
      ) {
        positions[i * 3] = (Math.random() - 0.5) * 30
        positions[i * 3 + 1] = -10
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30
      }
    }
  })

  return (
    <Points positions={particles.positions} stride={3}>
      <PointMaterial
        transparent
        alphaMap={circleParticles}
        color="#FF4500"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}

export default ParticlesFlow
