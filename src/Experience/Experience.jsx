import { OrbitControls } from '@react-three/drei'
import MemoryGame from './memoryGame/MemoryGame.jsx'

export default function Experience() {
  return (
    <>
      <OrbitControls />

      <MemoryGame />
    </>
  )
}
