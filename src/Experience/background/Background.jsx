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
import fogVertexShader from '../materials/shaders/fog2/vertex.glsl'
import fogFragmentShader from '../materials/shaders/fog2/fragment.glsl'
import cloudsVertexShader from '../materials/shaders/clouds/vertex.glsl'
import cloudsFragmentShader from '../materials/shaders/clouds/fragment.glsl'

export default function Background() {
  const fogMeshRef = useRef()
  const cloudsMeshRef = useRef()
  const cloudsMaterialRef = useRef()
  const { width, height } = useThree((state) => state.viewport)
  const { size } = useThree()
  console.log(size)

  const { color } = useControls('floorColor', {
    color: '#0d1421',
  })

  const { moonColor, moonEmissive, moonEmissiveIntensity, moonPosition } =
    useControls('moon', {
      moonColor: '#ffffff',
      moonEmissive: '#ffff00',
      moonEmissiveIntensity: 0.5,
      moonPosition: { x: 10, y: 10, z: -25 },
    })

  const {
    cloudsPosition,
    cloudsColor1,
    cloudsColor2,
    cloudsColor3,
    cloudsColor4,
  } = useControls('clouds', {
    cloudsPosition: { x: 0, y: 11, z: -15 },
    cloudsColor1: '#d37a15',
    cloudsColor2: '#da2e6a',
    cloudsColor3: '#0f6dfa',
    cloudsColor4: '#11d0de',
  })

  const perlinTexture = useLoader(TextureLoader, '/fog-noise.png')
  perlinTexture.wrapS = RepeatWrapping
  perlinTexture.wrapT = RepeatWrapping

  useFrame((state, delta) => {
    // if (pointLightRef1.current) {
    //   pointLightRef1.current.position.y = Math.sin(Date.now() * 0.001) * 0.2 + 2 // Small subtle movement for mood
    // }
    if (cloudsMaterialRef.current) {
      console.log(cloudsMaterialRef.current)

      cloudsMaterialRef.current.uniforms.uTime.value += delta * 0.2

      cloudsMaterialRef.current.uniforms.uCloudColor1.value.set(cloudsColor1) // Update unif
      cloudsMaterialRef.current.uniforms.uCloudColor2.value.set(cloudsColor2) // Update uniform color every frame
      cloudsMaterialRef.current.uniforms.uCloudColor3.value.set(cloudsColor3) // Update uniform color every frame
      cloudsMaterialRef.current.uniforms.uCloudColor4.value.set(cloudsColor4) // Update uniform color every frame
    }
  })

  // Create the shape with a circular hole
  const createUShape = () => {
    const shape = new Shape()
    const shapeWidth = width * 4 // Width of the base rectangle
    const shapeHeight = height * 2.9 // Height of the base rectangle

    // Define base rectangle shape
    shape.moveTo(-shapeWidth / 2, -shapeHeight / 2)
    shape.lineTo(shapeWidth / 2, -shapeHeight / 2)
    shape.lineTo(shapeWidth / 2, shapeHeight / 2)
    shape.lineTo(-shapeWidth / 2, shapeHeight / 2)
    shape.lineTo(-shapeWidth / 2, -shapeHeight / 2)

    // Define the hole (circle) in the middle
    const hole = new Path()
    const holeRadius = 10

    hole.absellipse(0, 11, holeRadius, holeRadius, 0, Math.PI * 2, false)
    shape.holes.push(hole)

    return shape
  }

  const uShape = createUShape()

  return (
    <>
      {/* Moon */}
      <mesh position={[moonPosition.x, moonPosition.y, moonPosition.z]}>
        <sphereGeometry args={[10, 64, 64]} />
        {/* Radius, width segments, height segments */}
        <meshStandardMaterial
          color={moonColor}
          emissive={moonEmissive} // Makes the moon look like it's glowing
          emissiveIntensity={moonEmissiveIntensity}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 4, 30]} />
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

      {/* Fog foregound */}
      {/* <mesh ref={fogMeshRef} position={(0, 0, 0)}>
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
      </mesh> */}
    </>
  )
}
