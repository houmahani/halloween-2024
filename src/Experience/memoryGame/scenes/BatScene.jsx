import { useRef, useEffect, useState } from 'react'
import { BackSide, MeshBasicMaterial } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PositionalAudio } from '@react-three/drei'

const BatScene = ({ matchedElements }) => {
  const batGltf = useLoader(GLTFLoader, '/models/bat.glb')
  const batClone = batGltf.scene.clone()
  const wingRef = useRef()
  const leftWingRef = useRef()
  const rightWingRef = useRef()
  const [isFlapping, setIsFlapping] = useState(false)

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

  useFrame((state, delta) => {
    if (matchedElements.includes('bats')) {
      setIsFlapping(true)
      if (isFlapping) {
        const time = state.clock.getElapsedTime()
        const flapAmplitude = 0.5 // Adjust for the flapping range
        const flapSpeed = 20 // Adjust for flapping speed

        if (leftWingRef.current) {
          leftWingRef.current.rotation.z =
            Math.sin(time * flapSpeed) * flapAmplitude
        }

        if (rightWingRef.current) {
          rightWingRef.current.rotation.z =
            -Math.sin(time * flapSpeed) * flapAmplitude // Opposite direction
        }
      }
    }
  })

  return (
    <group>
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
      <mesh rotation={[0, 0, -5]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={'#ffbb00'} side={BackSide} />
      </mesh>

      {/* Pumpkin */}
      <group>
        <primitive object={batClone} castShadow rotation={[0, Math.PI, 0]} />
      </group>
    </group>
  )
}

export default BatScene
