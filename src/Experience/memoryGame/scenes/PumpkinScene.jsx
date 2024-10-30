import { useRef, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { BackSide, MeshStandardMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PumpkinScene = ({ matchedElements }) => {
  const groupRef = useRef()
  const emissiveObjectRef = useRef([])

  const pumpkinGltf = useLoader(GLTFLoader, '/models/pumpkin.glb')
  const pumpkinClone = pumpkinGltf.scene.clone()

  useEffect(() => {
    emissiveObjectRef.current = []

    pumpkinClone.children.forEach((child) => {
      if (child.children.length > 0) {
        const emissiveChild = child.children[0]

        emissiveChild.material = new MeshStandardMaterial({
          emissive: '#ffdb11',
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0,
        })
        emissiveChild.material.needsUpdate = true

        if (!emissiveObjectRef.current.includes(emissiveChild.material)) {
          emissiveObjectRef.current.push(emissiveChild.material)
        }
      }
    })
  }, [pumpkinClone])

  useFrame((_state, delta) => {
    if (
      matchedElements.includes('pumpkin') &&
      emissiveObjectRef.current.length > 0
    ) {
      emissiveObjectRef.current.forEach((material) => {
        if (material.opacity < 1) {
          material.opacity += delta * 0.5
          material.needsUpdate = true
        }
      })
    }
  })

  return (
    <group>
      {/* Lights */}
      <directionalLight
        position={[0, 0, -5]}
        color={'#ffbf00'}
        intensity={3}
        castShadow
      />

      {/* Background */}
      <mesh rotation={[0, 0, -5]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={'black'} side={BackSide} />
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

export default PumpkinScene
