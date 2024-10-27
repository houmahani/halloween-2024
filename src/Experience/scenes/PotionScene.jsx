import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { DoubleSide, MeshPhysicalMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cameraPosition } from 'three/webgpu'

const PotionScene = ({ matchedElements }) => {
  const groupRef = useRef()
  const objectRef = useRef()
  const { camera } = useThree()

  // Load the pumpkin model and immediately clone it to avoid modifying the original
  const pumpkinGltf = useLoader(GLTFLoader, '/potion.glb')
  const pumpkinClone = pumpkinGltf.scene.clone()

  // Set material for the cloned pumpkin scene
  useEffect(() => {
    pumpkinClone.traverse((child) => {
      // if (child.isMesh) {
      //   child.material = new MeshPhysicalMaterial({
      //     color: '#874e0d',
      //     roughness: 0.5,
      //     metalness: 0.1,
      //   })
      // }
    })

    // Ensure the pumpkin's position is well centered
    // pumpkinClone.position.set(0, 0, 0)
  }, [pumpkinClone])

  // Animate rotation consistently for a floating effect
  useFrame((state, delta) => {
    const { x, y } = state.pointer // Normalized coordinates (-0.5 to 0.5)
    if (matchedElements.includes('potion')) {
      if (groupRef.current) {
        // Scale and offset to make the eye center correctly with the mouse
        const maxRotation = Math.PI * 0.5 // Adjust this to limit the rotation range

        const targetXRotation = Math.max(
          -maxRotation,
          Math.min(y * Math.PI * 5, maxRotation)
        )
        const targetYRotation = Math.max(
          -maxRotation,
          Math.min(x * Math.PI * 5, maxRotation)
        )

        // Smooth rotation easing
        groupRef.current.rotation.x +=
          (targetXRotation - groupRef.current.rotation.x) * delta * 15
        groupRef.current.rotation.y +=
          (targetYRotation - groupRef.current.rotation.y) * delta * 15
      }
    }
  })

  return (
    <group>
      {/* Set up consistent camera */}

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} castShadow />
      {/* Larger Floor Plane for Consistency */}
      <mesh
        rotation={[0, 0, -5]}
        position={[0, -1, 0]} // Move it lower to avoid seeing from sides
        receiveShadow
      >
        <planeGeometry args={[10, 10]} /> // Increase size
        <meshBasicMaterial color={'orange'} side={DoubleSide} />
      </mesh>
      {/* Pumpkin */}
      <group ref={groupRef}>
        <primitive
          object={pumpkinClone}
          castShadow
          rotation={[0, Math.PI, 0]}
        />
      </group>
    </group>
  )
}

export default PotionScene
