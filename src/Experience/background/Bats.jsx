import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useMatchedElements } from '../MatchedElementsContext.jsx'

function Bats() {
  const spheresRef = useRef([]) // Store references to each sphere
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const { matchedElements } = useMatchedElements()

  const numSpheres = 10

  // Initialize start and end positions, and spheres only once
  const { startPositions, endPositions } = useMemo(() => {
    const starts = []
    const ends = []
    const spheres = []

    for (let i = 0; i < numSpheres; i++) {
      const startPosition = new THREE.Vector3(0, 0, 0)
      const endPosition = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 20
      )

      starts.push(startPosition)
      ends.push(endPosition)

      const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16)
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 'black',
        transparent: true,
        opacity: 0,
      })

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.copy(startPosition)
      spheres.push(sphere)
    }

    spheresRef.current = spheres // Store spheres in the ref

    return { startPositions: starts, endPositions: ends }
  }, [numSpheres])

  useFrame((state, delta) => {
    if (
      !animationTriggered ||
      spheresRef.current.length === 0 ||
      endPositions.length === 0
    )
      return

    spheresRef.current.forEach((sphere, i) => {
      if (sphere && endPositions[i]) {
        // Interpolate position towards the end position
        sphere.position.lerp(endPositions[i], delta * 0.5)

        // Gradually increase opacity
        if (sphere.material.opacity < 1) {
          sphere.material.opacity += delta * 0.5
        }

        sphere.material.needsUpdate = true // Ensure material updates
      }
    })
  })

  // Trigger animation
  useEffect(() => {
    if (matchedElements.includes('bats')) {
      setAnimationTriggered(true)
    }
  }, [matchedElements])

  return (
    <>
      {spheresRef.current.map((sphere, i) => (
        <primitive object={sphere} key={i} />
      ))}
    </>
  )
}

export default Bats
