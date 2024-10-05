import { useState, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { geometry } from 'maath'
import { FrontSide, BackSide, DoubleSide } from 'three'
extend(geometry)

export default function Experience() {
  const [flipped, setFlipped] = useState(false)
  const [rotationY, setRotationY] = useState(0)
  const cardRef = useRef()

  const fragmentShader = `
  varying vec3 vNormal;

  void main() {
    if (gl_FrontFacing) {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red for the front
    } else {
      gl_FragColor = vec4(1.0, 0.75, 0.8, 1.0); // Pink for the back
    }
  }
`

  const vertexShader = `
  varying vec3 vNormal;

  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

  // Handle flipping when clicked
  const handleClick = () => {
    setFlipped(!flipped)
    setRotationY((prev) => prev + Math.PI) // Rotate by 180 degrees (Math.PI) to flip
  }

  // Animate the rotation using useFrame
  useFrame((state, delta) => {
    if (cardRef.current) {
      cardRef.current.rotation.y +=
        (rotationY - cardRef.current.rotation.y) * delta * 4
    }
  })

  return (
    <>
      <OrbitControls />

      <mesh ref={cardRef} onClick={handleClick}>
        <roundedPlaneGeometry args={[2, 3, 0.1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}
