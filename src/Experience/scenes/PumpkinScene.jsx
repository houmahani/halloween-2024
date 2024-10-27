import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import {
  DoubleSide,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cameraPosition } from 'three/webgpu'

const PumpkinScene = ({ matchedElements }) => {
  console.log(matchedElements)

  const groupRef = useRef()
  const pointLightRef = useRef()
  const objectRef = useRef()
  const emissiveObjectRef = useRef([])
  const { camera } = useThree()

  // Load the pumpkin model and immediately clone it to avoid modifying the original
  const pumpkinGltf = useLoader(GLTFLoader, '/pumpkin.glb')
  const pumpkinClone = pumpkinGltf.scene.clone()

  // Set material for the cloned pumpkin scene
  useEffect(() => {
    // Clear the ref at the beginning to prevent duplicates
    emissiveObjectRef.current = []

    pumpkinClone.children.forEach((child) => {
      // Apply primary material to each child
      child.material = new MeshStandardMaterial({
        color: '#ff6600',
        roughness: 1,
        metalness: 0.5,
      })

      // Handle emissive material for nested child
      if (child.children.length > 0) {
        const emissiveChild = child.children[0]

        // Apply emissive properties
        emissiveChild.material = new MeshStandardMaterial({
          emissive: '#ff6011',
          emissiveIntensity: 2,
          transparent: true,
          opacity: 0,
        })
        emissiveChild.material.needsUpdate = true

        // Store only if not already in the ref
        if (!emissiveObjectRef.current.includes(emissiveChild.material)) {
          emissiveObjectRef.current.push(emissiveChild.material)
        }
      }
    })

    // Center position if needed
    pumpkinClone.position.set(0, 0, 0)
  }, [pumpkinClone])

  // Animate rotation consistently for a floating effect
  useFrame((state, delta) => {
    if (groupRef.current) {
      // groupRef.current.rotation.y += delta * 0.2 // Add rotation about the y-axis for animation
      // groupRef.current.lookAt(state.pointer)
    }

    // Check if pumpkin is matched and emissiveObjectRef has materials
    if (
      matchedElements.includes('pumpkin') &&
      emissiveObjectRef.current.length > 0
    ) {
      emissiveObjectRef.current.forEach((material) => {
        // Increase opacity gradually

        if (material.opacity < 1) {
          // Ensure it doesn't exceed full opacity
          material.opacity += delta * 0.5 // Adjust this multiplier for speed
          material.needsUpdate = true // Force update for the material
        }
      })
    }
  })

  return (
    <group>
      {/* Set up consistent camera */}

      <directionalLight
        position={[0, 0, -5]}
        color={'#ffbf00'}
        intensity={3}
        castShadow
      />

      {/* Larger Floor Plane for Consistency */}
      <mesh
        rotation={[0, 0, -5]}
        position={[0, -1, 0]} // Move it lower to avoid seeing from sides
        receiveShadow
      >
        <planeGeometry args={[10, 10]} /> // Increase size
        <meshBasicMaterial color={'orange'} side={DoubleSide} />
      </mesh>

      {/* <mesh receiveShadow>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          emissive={'#ff6600'}
          emissiveIntensity={3}
          side={DoubleSide}
        />
      </mesh> */}
      {/* Pumpkin */}

      <group ref={groupRef}>
        <primitive
          object={pumpkinClone}
          castShadow
          rotation={[0, Math.PI, 0]}
        />
      </group>

      {/* 
      <pointLight
        ref={pointLightRef}
        color={'#ff8800'}
        intensity={30}
        distance={10}
        position={groupRef.position}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      /> */}
    </group>
  )
}

export default PumpkinScene
