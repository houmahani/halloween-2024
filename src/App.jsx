import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import Experience from './Experience/Experience.jsx'

import './App.css'

function App() {
  const { canvasColor } = useControls('Canvas Background', {
    canvasColor: '#233f5b',
  })

  const { fogColor } = useControls('Fog Color', {
    fogColor: '#233f5b',
  })

  return (
    <>
      <Leva />
      <Canvas>
        <color attach="background" args={[canvasColor]} />
        <fog attach="fog" args={[fogColor, 0, 20]} />
        <Environment preset="dawn" />
        <Experience />
      </Canvas>
    </>
  )
}

export default App
