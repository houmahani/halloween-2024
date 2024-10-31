import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { Color, DoubleSide, MeshStandardMaterial, Vector2 } from 'three'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useMemoryGameContext } from '@/contexts/MemoryGameContext.jsx'
import fogVertexShader from '@/components/experience/materials/shaders/fog/vertex.glsl'
import fogFragmentShader from '@/components/experience/materials/shaders/fog/fragment.glsl'
import cloudsVertexShader from '@/components/experience/materials/shaders/clouds/vertex.glsl'
import cloudsFragmentShader from '@/components/experience/materials/shaders/clouds/fragment.glsl'
import Particles from '@/components/experience/background/Particles.jsx'
import Bats from '@/components/experience/background/Bats.jsx'

export default function Background() {
  const { matchedElements } = useMemoryGameContext()
  const { width, height } = useThree((state) => state.viewport)

  const emissiveObjectRef = useRef([])
  const foregroundTreeRef = useRef()
  const backgroundTreeRef = useRef()
  const fogMaterialRef = useRef()
  const cloudsMaterialRef = useRef()

  const perlinTexture = useLoader(TextureLoader, '/textures/fog-noise.png')
  const treeGltf = useLoader(GLTFLoader, '/models/tree.glb', (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
  })
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

  const houseClone = clone(house.scene)

  useEffect(() => {
    houseClone.traverse((child) => {
      if (child.children.length > 0) {
        const houseMesh = child.children[0]
        if (houseMesh.children.length > 0) {
          const emissiveChild = houseMesh.children[0]
          emissiveChild.material = new MeshStandardMaterial({
            color: '#ffd900',
            emissive: '#ffd900',
            emissiveIntensity: 2,
            transparent: true,
            opacity: 0,
            side: DoubleSide,
          })
          emissiveObjectRef.current.push(emissiveChild.material)
        }
      }
    })
  }, [houseClone])

  const cloudsUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new Vector2(2000, 2000) },
      uCloudColor1: { value: new Color(0xdba9ff) },
      uCloudColor2: { value: new Color(0xc0d4eb) },
      uCloudColor3: { value: new Color(0x6e56d0) },
      uCloudColor4: { value: new Color(0x8cadd5) },
    }),
    []
  )

  useEffect(() => {
    if (matchedElements.includes('candle')) {
      emissiveObjectRef.current.forEach((material) => {
        material.opacity = 1
        material.needsUpdate = true
      })
    }
  }, [matchedElements])

  useFrame((state, delta) => {
    // Clouds animation
    if (cloudsMaterialRef.current) {
      cloudsMaterialRef.current.uniforms.uTime.value += delta * 0.5
    }

    // Tree swaying effect
    const swayFactor = Math.sin(state.clock.getElapsedTime())
    if (foregroundTreeRef.current) {
      foregroundTreeRef.current.rotation.z = swayFactor * 0.05
    }
    if (backgroundTreeRef.current) {
      backgroundTreeRef.current.rotation.z = swayFactor * 0.03
    }
  })

  return (
    <>
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
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffff00}
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
          uniforms={cloudsUniforms}
        />
      </mesh>

      <Bats />

      {/* Custom Fog */}
      <mesh>
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

      <Particles />

      <primitive
        ref={foregroundTreeRef}
        position={[-3, -2, 3]}
        object={treeClone}
        scale={[1.5, 1.5, 1.5]}
      />
      <primitive
        ref={backgroundTreeRef}
        position={[17, -4, -18]}
        object={secondTreeClone}
        scale={[5, 5, 5]}
      />
      <primitive
        position={[30, -6, -25]}
        object={houseClone}
        scale={[3.5, 3.5, 3.5]}
      />
    </>
  )
}
