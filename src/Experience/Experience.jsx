import { OrbitControls } from '@react-three/drei'
import MemoryGame from './memoryGame/MemoryGame.jsx'
import Background from './background/Background.jsx'

export default function Experience() {
  return (
    <>
      <OrbitControls />

      <MemoryGame />

      <Background />
    </>
  )
}
