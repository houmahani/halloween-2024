import { BackSide, DoubleSide, ShaderMaterial, TextureLoader } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useRef } from 'react'
import candleFlameVertexShader from '../../materials/shaders/flame/vertex.glsl'
import candleFlameFragmentShader from '../../materials/shaders/flame/fragment.glsl'
import { PositionalAudio } from '@react-three/drei'

const SkullCandleScene = ({ matchedElements }) => {
  const flameMaterialRef = useRef()

  const texture1 = useLoader(TextureLoader, '/textures/flame_05.png')
  const texture2 = useLoader(TextureLoader, '/textures/flame_06.png')
  texture1.flipY = false
  texture2.flipY = false

  const skullCandleGltf = useLoader(GLTFLoader, '/models/skull-candle.glb')
  const skullCandleClone = skullCandleGltf.scene.clone()

  skullCandleClone.traverse((child) => {
    if (child.name === 'flame') {
      child.material = new ShaderMaterial({
        vertexShader: candleFlameVertexShader,
        fragmentShader: candleFlameFragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: 0.0 },
          uTexture1: { value: texture1 },
          uTexture2: { value: texture2 },
        },
        side: DoubleSide,
      })

      flameMaterialRef.current = child.material
    }
  })

  useFrame((state, delta) => {
    if (matchedElements.includes('candle')) {
      // Increment uScale gradually, clamped to a maximum of 1.0
      flameMaterialRef.current.uniforms.uScale.value = Math.min(
        flameMaterialRef.current.uniforms.uScale.value + delta * 0.5,
        1.0
      )
      flameMaterialRef.current.uniforms.uTime.value += delta
    }
  })

  return (
    <group>
      {matchedElements.includes('candle') && (
        <PositionalAudio
          autoplay
          loop={false}
          url="/sounds/candle-lighting.mp3"
          distance={0.8}
        />
      )}

      {/* Lights */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, -5]} intensity={1} />

      {/* Background */}
      <mesh rotation={[0, 0, -5]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={'#ca0a13'} side={BackSide} />
      </mesh>

      {/* Skull Candle */}
      <group>
        <primitive
          object={skullCandleClone}
          castShadow
          rotation={[0, Math.PI, 0]}
        />
      </group>
    </group>
  )
}

export default SkullCandleScene
