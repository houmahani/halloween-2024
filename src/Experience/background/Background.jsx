import { MeshReflectorMaterial } from '@react-three/drei'
import { useControls } from 'leva'

export default function Background() {
  const { color } = useControls('floorColor', {
    color: '#0d1421',
  })

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
          color={color}
          metalness={0.6}
          roughness={1}
        />
      </mesh>
    </>
  )
}
