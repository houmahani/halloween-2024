import { useRef, useEffect, useState } from 'react'
import { BackSide } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useFrame, useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'

const BatScene = ({ matchedElements }) => {
  const leftWingRef = useRef()
  const rightWingRef = useRef()

  const [isFlapping, setIsFlapping] = useState(false)

  const batGltf = useLoader(GLTFLoader, '/models/bat.glb')
  const batClone = batGltf.scene.clone()

  useEffect(() => {
    batClone.traverse((child) => {
      if (child.name === 'left_wing') {
        leftWingRef.current = child
      }
      if (child.name === 'right_wing') {
        rightWingRef.current = child
      }
    })
  }, [batClone])

  useFrame((state) => {
    if (matchedElements.includes('bats')) {
      setIsFlapping(true)
      if (isFlapping) {
        const time = state.clock.getElapsedTime()
        const flapAmplitude = 0.5
        const flapSpeed = 20

        if (leftWingRef.current) {
          leftWingRef.current.rotation.z =
            Math.sin(time * flapSpeed) * flapAmplitude
        }

        if (rightWingRef.current) {
          rightWingRef.current.rotation.z =
            -Math.sin(time * flapSpeed) * flapAmplitude
        }
      }
    }
  })

  return (
    <group>
      {/* Audio */}
      {matchedElements.includes('bats') && (
        <PositionalAudio
          autoplay
          loop={false}
          url="/sounds/magic_wings.mp3"
          distance={1}
        />
      )}

      {/* Lights */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, -5]} intensity={2} />

      {/* Background */}
      <mesh rotation={[0, 0, -5]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={'#ffbb00'} side={BackSide} />
      </mesh>

      {/* Pumpkin */}
      <group>
        <primitive object={batClone} rotation={[0, Math.PI, 0]} />
      </group>
    </group>
  )
}

export default BatScene
