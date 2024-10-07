import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import Experience from './Experience/Experience.jsx'

import './App.css'

function App() {
  return (
    <Canvas>
      <color attach="background" args={['#0b0429']} />
      <Environment preset="dawn" />
      <Experience />
    </Canvas>
  )
}

export default App
