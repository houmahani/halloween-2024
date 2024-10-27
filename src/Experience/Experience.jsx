import { OrbitControls } from '@react-three/drei'
import MemoryGame from './memoryGame/MemoryGame.jsx'
import Background from './background/Background.jsx'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PointLightHelper,
} from 'three'
import { useLoader } from '@react-three/fiber'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useControls } from 'leva'

export default function Experience() {
  const pointLightRef1 = useRef()
  const pointLightRef2 = useRef()
  const helper1 = useRef()
  const helper2 = useRef()
  const pumpkinGltf = useLoader(GLTFLoader, '/pumpkin.glb')
  const treeGltf = useLoader(GLTFLoader, '/tree.glb')
  const secondTreeGltf = useLoader(GLTFLoader, '/tree.glb')
  const house = useLoader(GLTFLoader, '/house.glb')
  const firstClone = clone(pumpkinGltf.scene)
  firstClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshPhysicalMaterial({ color: 'red' })
    }
  })
  const secondClone = clone(pumpkinGltf.scene)
  secondClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshPhysicalMaterial({ color: 'red' })
    }
  })

  const thirdClone = clone(pumpkinGltf.scene)
  thirdClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 'orange' })
    }
  })
  const fourthClone = clone(pumpkinGltf.scene)
  fourthClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshPhysicalMaterial({ color: 'red' })
    }
  })

  const treeClone = clone(treeGltf.scene)
  treeClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x000000 })
    }
  })

  const secondTreeClone = clone(secondTreeGltf.scene)
  secondTreeClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x000000 })
    }
  })

  const houseClone = clone(house.scene)
  houseClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshBasicMaterial({ color: 0x000000 })
    }
  })

  // Add light helpers once lights are created
  useEffect(() => {
    if (pointLightRef1.current && pointLightRef2.current) {
      // Create the helpers and add them to the scene
      helper1.current = new PointLightHelper(pointLightRef1.current, 1)
      helper2.current = new PointLightHelper(pointLightRef2.current, 1)

      const scene = pointLightRef1.current.parent // Assumes lights are added to the main scene
      scene.add(helper1.current)
      scene.add(helper2.current)
    }
  }, [pointLightRef1, pointLightRef2])

  useFrame(() => {
    if (helper1.current && helper2.current) {
      helper1.current.update()
      helper2.current.update()
    }
  })

  return (
    <>
      <OrbitControls />

      {/* Point Lights */}
      {/* <pointLight
        ref={pointLightRef1}
        color={'#f0a4eb'}
        intensity={3000}
        distance={0}
        position={[5, 3, 0]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        ref={pointLightRef2}
        color={'#ffcc88'}
        intensity={2000}
        distance={0}
        position={[-5, 3, -5]}
        castShadow
      /> */}
      {/* Optional: Add Ambient Light for Some Global Lighting */}
      <ambientLight intensity={15.3} color="#ffffff" />

      <MemoryGame />
      {/* 
      <primitive
        position={[-4.5, -3, 0]}
        object={firstClone}
        scale={[1.5, 1.5, 1.5]}
        rotation={[0, 0.2, 0]}
      />

      <primitive
        position={[-2.5, -3, 0]}
        object={secondClone}
        scale={[1, 1, 1]}
        rotation={[0, 0, 0]}
      />

      <primitive
        position={[7, -3, -2]}
        object={thirdClone}
        scale={[1.5, 1.5, 1.5]}
        rotation={[0, -1.2, 0]}
      />

      <primitive
        position={[6, -3, -3]}
        object={fourthClone}
        scale={[1, 1, 1]}
        rotation={[0, -1.5, 0]}
      />
*/}
      <primitive
        position={[-3, -2, 3]}
        object={treeClone}
        scale={[1.5, 1.5, 1.5]}
        rotation={[0, 0, 0]}
      />
      <primitive
        position={[17, -4, -18]}
        object={secondTreeClone}
        scale={[3, 3, 3]}
        rotation={[0, 0, 0]}
      />

      {/* <primitive
        position={[15, -3, -18]}
        object={houseClone}
        scale={[2.5, 2.5, 2.5]}
        rotation={[0, 0, 0]}
      /> */}
      <Background />
    </>
  )
}
