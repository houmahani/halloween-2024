import { MeshReflectorMaterial } from '@react-three/drei'

export default function Background() {
  return (
    <>
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#0b0429"
          metalness={0.6}
          roughness={1}
        />
      </mesh>
    </>
  )
}
