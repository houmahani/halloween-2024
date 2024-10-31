import { useRef, useEffect, useState, useMemo } from 'react'
import { Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useFrame, useLoader } from '@react-three/fiber'
import { useMemoryGameContext } from '@/contexts/MemoryGameContext.jsx'

function Bats() {
  const { matchedElements, resetGame } = useMemoryGameContext()
  const batsRef = useRef([])
  const leftWingRefs = useRef([])
  const rightWingRefs = useRef([])
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const numBats = 10

  const batGltf = useLoader(GLTFLoader, '/models/bat.glb')

  const { startPositions, endPositions } = useMemo(() => {
    const starts = []
    const ends = []
    const bats = []

    for (let i = 0; i < numBats; i++) {
      const startPosition = new Vector3(0, 0, 0)
      const endPosition = new Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - -1) * 5
      )

      starts.push(startPosition)
      ends.push(endPosition)

      const batClone = batGltf.scene.clone()
      batClone.position.copy(startPosition)
      batClone.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone()
          child.material.transparent = true
          child.material.opacity = 0
        }
        if (child.name === 'left_wing') leftWingRefs.current.push(child)
        if (child.name === 'right_wing') rightWingRefs.current.push(child)
      })
      bats.push(batClone)
    }

    batsRef.current = bats

    return { startPositions: starts, endPositions: ends }
  }, [batGltf, numBats])

  useEffect(() => {
    if (resetGame) {
      setAnimationTriggered(false)
      batsRef.current.forEach((bat, i) => {
        bat.position.copy(startPositions[i])
        bat.traverse((child) => {
          if (child.isMesh) {
            child.material.opacity = 0
            child.material.needsUpdate = true
          }
        })
      })
    }
  }, [resetGame, startPositions])

  useEffect(() => {
    if (matchedElements.includes('bats') && !animationTriggered) {
      setAnimationTriggered(true)

      const timeout = setTimeout(() => {
        setAnimationTriggered(false)

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
    const flapAmplitude = 0.5
    const flapSpeed = 20

    batsRef.current.forEach((bat, i) => {
      if (bat && endPositions[i]) {
        bat.position.lerp(endPositions[i], delta * 0.5)

        const distanceToEnd = bat.position.distanceTo(endPositions[i])

        bat.traverse((child) => {
          if (child.isMesh) {
            if (distanceToEnd > 2 && child.material.opacity < 1) {
              child.material.opacity += delta * 0.5
            } else if (distanceToEnd <= 2) {
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
