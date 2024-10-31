import {
  OrthographicCamera,
  PerspectiveCamera,
  PositionalAudio,
} from '@react-three/drei'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { BackSide, DoubleSide, MeshPhysicalMaterial, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cameraPosition } from 'three/webgpu'

const EyeBallScene = ({ matchedElements }) => {
  const groupRef = useRef()
  const eyeBallGltf = useLoader(GLTFLoader, '/models/eyeball.glb')
  const eyeBallClone = eyeBallGltf.scene.clone()

  useFrame((state, delta) => {
    const { x, y } = state.pointer

    if (matchedElements.includes('eyeball') && groupRef.current) {
      const maxRotation = Math.PI * 0.5

      // Map normalized pointer position to rotation range
      const targetXRotation = Math.max(
        -maxRotation,
        Math.min(y * Math.PI * 0.5, maxRotation)
      )
      const targetYRotation = Math.max(
        -maxRotation,
        Math.min(x * Math.PI * 0.5, maxRotation)
      )

      // Apply smooth rotation
      groupRef.current.rotation.x +=
        (targetXRotation - groupRef.current.rotation.x) * delta * 15
      groupRef.current.rotation.y +=
        (targetYRotation - groupRef.current.rotation.y) * delta * 15
    }
  })

  return (
    <group>
      {matchedElements.includes('eyeball') && (
        <PositionalAudio
          autoplay
          loop={false}
          url="/sounds/geistergeheul.mp3"
          distance={0.1}
        />
      )}

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, -5]} intensity={2} castShadow />

      {/* Background */}
      <mesh rotation={[0, 0, -5]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={'#26a4ff'} side={BackSide} />
      </mesh>

      {/* Eyeball*/}
      <group ref={groupRef}>
        <primitive
          object={eyeBallClone}
          castShadow
          rotation={[0, Math.PI, 0]}
        />
      </group>
    </group>
  )
}

export default EyeBallScene
