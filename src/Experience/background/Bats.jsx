import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { useMatchedElements } from '../MatchedElementsContext.jsx'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function Bats() {
  const batsRef = useRef([]) // Store references to each bat
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const {
    matchedElements,

    resetGame,
  } = useMatchedElements()
  const batGltf = useLoader(GLTFLoader, '/models/bat.glb')
  const numBats = 10

  const leftWingRefs = useRef([])
  const rightWingRefs = useRef([])

  const { startPositions, endPositions } = useMemo(() => {
    const starts = []
    const ends = []
    const bats = []

    for (let i = 0; i < numBats; i++) {
      const startPosition = new THREE.Vector3(0, 0, 0)
      const endPosition = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - -1) * 5
      )

      starts.push(startPosition)
      ends.push(endPosition)

      const batClone = batGltf.scene.clone() // Create a new clone for each bat
      batClone.position.copy(startPosition)
      batClone.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone() // Clone the material for each bat
          child.material.transparent = true
          child.material.opacity = 0
        }
        if (child.name === 'left_wing') leftWingRefs.current.push(child)
        if (child.name === 'right_wing') rightWingRefs.current.push(child)
      })
      bats.push(batClone)
    }

    batsRef.current = bats // Store bats in the ref

    return { startPositions: starts, endPositions: ends }
  }, [batGltf, numBats])

  // Reset animation on game reset
  useEffect(() => {
    if (resetGame) {
      setAnimationTriggered(false)
      batsRef.current.forEach((bat, i) => {
        bat.position.copy(startPositions[i]) // Reset bat position
        bat.traverse((child) => {
          if (child.isMesh) {
            child.material.opacity = 0 // Reset opacity
            child.material.needsUpdate = true
          }
        })
      })
    }
  }, [resetGame, startPositions])

  // Track matched elements to trigger animation
  useEffect(() => {
    if (matchedElements.includes('bats') && !animationTriggered) {
      setAnimationTriggered(true)

      // Reset animation after 5 seconds
      const timeout = setTimeout(() => {
        setAnimationTriggered(false)
        // Reset positions and opacities
        batsRef.current.forEach((bat, i) => {
          bat.position.copy(startPositions[i])
          bat.traverse((child) => {
            if (child.isMesh) {
              child.material.opacity = 0
              child.material.needsUpdate = true
            }
          })
        })
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [matchedElements, animationTriggered, startPositions])

  useFrame((state, delta) => {
    if (
      !animationTriggered ||
      batsRef.current.length === 0 ||
      endPositions.length === 0
    )
      return

    const time = state.clock.getElapsedTime()
    const flapAmplitude = 0.5 // Adjust for the flapping range
    const flapSpeed = 20 // Adjust for flapping speed

    batsRef.current.forEach((bat, i) => {
      if (bat && endPositions[i]) {
        // Interpolate position towards the end position
        bat.position.lerp(endPositions[i], delta * 0.5)

        // Calculate the distance to the end position
        const distanceToEnd = bat.position.distanceTo(endPositions[i])

        // Control opacity based on distance
        bat.traverse((child) => {
          if (child.isMesh) {
            if (distanceToEnd > 2 && child.material.opacity < 1) {
              // Increase opacity to fully visible if still far from the end
              child.material.opacity += delta * 0.5
            } else if (distanceToEnd <= 2) {
              // Start fading out when close to the end position
              child.material.opacity -= delta * 0.5
            }
            child.material.needsUpdate = true
          }
        })

        // Wing flapping animation
        if (leftWingRefs.current[i]) {
          leftWingRefs.current[i].rotation.z =
            Math.sin(time * flapSpeed) * flapAmplitude
        }
        if (rightWingRefs.current[i]) {
          rightWingRefs.current[i].rotation.z =
            -Math.sin(time * flapSpeed) * flapAmplitude // Opposite direction
        }
      }
    })
  })

  return (
    <>
      {batsRef.current.map((bat, i) => (
        <primitive object={bat} key={i} />
      ))}
    </>
  )
}

export default Bats
