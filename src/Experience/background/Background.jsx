import { useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import { DoubleSide, RepeatWrapping } from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import fogVertexShader from '../materials/shaders/fog/vertex.glsl'
import fogFragmentShader from '../materials/shaders/fog/fragment.glsl'

export default function Background() {
  const fogMeshRef = useRef()
  const { width, height } = useThree((state) => state.viewport)
  const { color } = useControls('floorColor', {
    color: '#0d1421',
  })

  const perlinTexture = useLoader(TextureLoader, '/fog-noise.png')
  perlinTexture.wrapS = RepeatWrapping
  perlinTexture.wrapT = RepeatWrapping

  useFrame((_, delta) => {
    if (fogMeshRef.current) {
      fogMeshRef.current.material.uniforms.uTime.value += delta
    }
  })

  return (
    <>
      {/* Floor */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.85}
          color={color}
          metalness={0.6}
          roughness={1}
        />
      </mesh>

      {/* Fog */}
      <mesh ref={fogMeshRef} position={(0, 0, 0)}>
        <planeGeometry args={[width, height]} />
        <shaderMaterial
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          side={DoubleSide}
          transparent={true}
          uniforms={{
            uTime: { value: 0 },
            uPerlinTexture: { value: perlinTexture },
          }}
        />
      </mesh>
    </>
  )
}
