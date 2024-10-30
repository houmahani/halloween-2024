import { useEffect, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, PositionalAudio } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import {
  Color,
  DoubleSide,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector2,
} from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import fogVertexShader from '../materials/shaders/fog/vertex.glsl'
import fogFragmentShader from '../materials/shaders/fog/fragment.glsl'
import cloudsVertexShader from '../materials/shaders/clouds/vertex.glsl'
import cloudsFragmentShader from '../materials/shaders/clouds/fragment.glsl'
import ParticlesFlow from './ParticlesFlow.jsx'
import { useMatchedElements } from '../MatchedElementsContext.jsx'

export default function Background() {
  const emissiveObjectRef = useRef([])
  const foregroundTreeRef = useRef()
  const backgroundTreeRef = useRef()
  const { width, height } = useThree((state) => state.viewport)
  const { matchedElements, audioTriggered } = useMatchedElements()
  const fogMaterialRef = useRef()
  const cloudsMaterialRef = useRef()

  const perlinTexture = useLoader(TextureLoader, '/textures/fog-noise.png')
  const treeGltf = useLoader(GLTFLoader, '/models/tree.glb')
  const house = useLoader(GLTFLoader, '/models/house.glb')

  const treeClone = clone(treeGltf.scene)
  treeClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x000000 })
    }
  })

  const secondTreeClone = clone(treeGltf.scene)
  secondTreeClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x000000 })
    }
  })
  // Clone the house object
  const houseClone = clone(house.scene)
  emissiveObjectRef.current = [] // Initialize the array only once, outside of traverse

  // Traverse through the clone
  houseClone.traverse((child) => {
    if (child.children.length > 0) {
      const houseMesh = child.children[0]

      if (houseMesh.children.length > 0) {
        const emissiveChild = houseMesh.children[0]

        // Set the emissive material on the target child
        emissiveChild.material = new MeshStandardMaterial({
          color: '#ffd900',
          emissive: '#ffd900',
          emissiveIntensity: 2,
          transparent: true,
          opacity: 0,
          side: DoubleSide,
        })

        emissiveChild.material.needsUpdate = true

        // Add the material reference to the array if it’s not already there
        if (!emissiveObjectRef.current.includes(emissiveChild.material)) {
          emissiveObjectRef.current.push(emissiveChild.material)
        }
      }
    }
  })

  // Handle opacity in the `useFrame` loop
  useFrame((state, delta) => {
    if (cloudsMaterialRef.current) {
      cloudsMaterialRef.current.uniforms.uTime.value += delta * 0.5
    }

    if (matchedElements.includes('candle')) {
      emissiveObjectRef.current.forEach((material) => {
        if (material.opacity < 1) {
          material.opacity += delta * 0.5 // Increase opacity gradually
        }
      })
    }

    if (foregroundTreeRef.current) {
      const sway = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05
      foregroundTreeRef.current.rotation.z = sway
    }

    if (backgroundTreeRef.current) {
      const sway = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05
      backgroundTreeRef.current.rotation.z = sway
    }
  })

  return (
    <>
      {audioTriggered && (
        <PositionalAudio
          autoplay
          loop
          url="/sounds/ambience.mp3"
          distance={0.8}
        />
      )}

      {/* Floor */}
      <mesh position={[0, -4, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 4, 20, 100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 1000]}
          resolution={1024}
          mixBlur={1}
          mixStrength={5}
          depthScale={1}
          minDepthThreshold={0.85}
          color={0x353b6c}
          metalness={0.5}
          roughness={1}
        />
      </mesh>

      {/* Moon */}
      <mesh position={[10, 12, -25]}>
        <circleGeometry args={[15, 64, 64]} />
        {/* Radius, width segments, height segments */}
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffff00} // Makes the moon look like it's glowing
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Clouds */}
      <mesh position={[0, 11, -15]}>
        <planeGeometry args={[width * 4, 30]} />
        <shaderMaterial
          ref={cloudsMaterialRef}
          vertexShader={cloudsVertexShader}
          fragmentShader={cloudsFragmentShader}
          transparent={true}
          uniforms={{
            uTime: { value: 0 },
            uResolution: { value: new Vector2(2000, 2000) },
            uCloudColor1: { value: new Color(0xdba9ff) },
            uCloudColor2: { value: new Color(0xc0d4eb) },
            uCloudColor3: { value: new Color(0x6e56d0) },
            uCloudColor4: { value: new Color(0x8cadd5) },
          }}
        />
      </mesh>

      {/* <Bats /> */}

      {/* Custom Fog foregound */}
      <mesh position={(0, 0, 0)}>
        <planeGeometry args={[width, height]} />
        <shaderMaterial
          ref={fogMaterialRef}
          transparent={true}
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uFogColor: { value: new Color('#4d2c59') },
            uPerlinTexture: { value: perlinTexture },
          }}
        />
      </mesh>

      <ParticlesFlow />

      <primitive
        ref={foregroundTreeRef}
        position={[-3, -2, 3]}
        object={treeClone}
        scale={[1.5, 1.5, 1.5]}
        rotation={[0, 0, 0]}
      />
      <primitive
        ref={backgroundTreeRef}
        position={[17, -4, -18]}
        object={secondTreeClone}
        scale={[3, 3, 3]}
        rotation={[0, 0, 0]}
      />

      <primitive
        position={[30, -6, -25]}
        object={houseClone}
        scale={[4, 4, 4]}
        rotation={[0, -0.5, 0]}
      />
    </>
  )
}
