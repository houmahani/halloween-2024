import { useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import {
  Color,
  DoubleSide,
  Path,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Vector2,
} from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import fogVertexShader from '../materials/shaders/fog/vertex.glsl'
import fogFragmentShader from '../materials/shaders/fog/fragment.glsl'
import cloudsVertexShader from '../materials/shaders/clouds/vertex.glsl'
import cloudsFragmentShader from '../materials/shaders/clouds/fragment.glsl'
import Bats from '../Bats.jsx'
import ParticlesFlow from './ParticlesFlow.jsx'

export default function Background() {
  const fogMeshRef = useRef()
  const fogMaterialRef = useRef()
  const cloudsMeshRef = useRef()
  const cloudsMaterialRef = useRef()
  const { width, height } = useThree((state) => state.viewport)
  const { size } = useThree()

  const { color } = useControls('floorColor', {
    color: '#353b6c',
  })

  const { moonColor, moonEmissive, moonEmissiveIntensity, moonPosition } =
    useControls('moon', {
      moonColor: '#ffffff',
      moonEmissive: '#ffff00',
      moonEmissiveIntensity: 0.5,
      moonPosition: { x: 10, y: 12, z: -25 },
    })

  const {
    cloudsPosition,
    cloudsColor1,
    cloudsColor2,
    cloudsColor3,
    cloudsColor4,
  } = useControls('clouds', {
    cloudsPosition: { x: 0, y: 11, z: -15 },
    cloudsColor1: '#dba9ff',
    cloudsColor2: '#c0d4eb',
    cloudsColor3: '#6e56d0',
    cloudsColor4: '#8cadd5',
  })

  const perlinTexture = useLoader(TextureLoader, '/fog-noise.png')

  useFrame((state, delta) => {
    if (cloudsMaterialRef.current) {
      cloudsMaterialRef.current.uniforms.uTime.value += delta * 0.5
    }
  })

  return (
    <>
      {/* Moon */}
      <mesh position={[moonPosition.x, moonPosition.y, moonPosition.z]}>
        <circleGeometry args={[15, 64, 64]} />
        {/* Radius, width segments, height segments */}
        <meshStandardMaterial
          color={moonColor}
          emissive={moonEmissive} // Makes the moon look like it's glowing
          emissiveIntensity={moonEmissiveIntensity}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -4, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 4, 20, 100, 100]} />
        {/* <shaderMaterial
          vertexShader={floorVertexShader}
          fragmentShader={floorFragmentShader}
          uniforms={{
            uFrequency: { value: 0.1 },
            uAmplitude: { value: 1 },
            uFloorColor: { value: new Color(color) },
          }}
        />*/}
        <MeshReflectorMaterial
          blur={[400, 1000]}
          resolution={1024}
          mixBlur={1}
          mixStrength={5}
          depthScale={1}
          minDepthThreshold={0.85}
          color={color}
          metalness={0.5}
          roughness={1}
        />
      </mesh>

      {/* Clouds */}
      <mesh
        ref={cloudsMeshRef}
        position={[cloudsPosition.x, cloudsPosition.y, cloudsPosition.z]}
      >
        <planeGeometry args={[width * 4, 30]} />
        {/* <primitive object={new ShapeGeometry(uShape)} /> */}
        <shaderMaterial
          ref={cloudsMaterialRef}
          vertexShader={cloudsVertexShader}
          fragmentShader={cloudsFragmentShader}
          side={DoubleSide}
          transparent={true}
          uniforms={{
            uResolution: { value: new Vector2(size.width, size.height) },
            uTime: { value: 0 },
            uCloudColor1: { value: new Color(cloudsColor1) },
            uCloudColor2: { value: new Color(cloudsColor2) },
            uCloudColor3: { value: new Color(cloudsColor3) },
            uCloudColor4: { value: new Color(cloudsColor4) },
          }}
        />
      </mesh>

      {/* <Bats /> */}

      {/* Fog behind */}
      {/* <mesh ref={fogMeshRef} position={(0, 0, -5)}>
        <planeGeometry args={[width * 5, height * 4]} />
        <shaderMaterial
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          side={DoubleSide}
          transparent={true}
          uniforms={{
            uFogDensity: { value: 0.5 },
            uTime: { value: 0 },
            uPerlinTexture: { value: perlinTexture },
          }}
        />
      </mesh> */}

      {/* Custom Fog foregound */}
      <mesh ref={fogMeshRef} position={(0, 0, 0)}>
        <planeGeometry args={[width, height]} />
        <shaderMaterial
          ref={fogMaterialRef}
          transparent={true}
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uPerlinTexture: { value: perlinTexture },
            uFogColor: { value: new Color('#4d2c59') },
          }}
        />
      </mesh>

      <ParticlesFlow />
    </>
  )
}
