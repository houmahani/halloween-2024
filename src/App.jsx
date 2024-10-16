import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import Experience from './Experience/Experience.jsx'

import './App.css'

function App() {
  const { canvasColor } = useControls('Canvas Background', {
    canvasColor: '#15021d',
  })

  const { fogColor } = useControls('Fog Color', {
    fogColor: '#000810',
  })

  return (
    <>
      <Leva flat />
      <Canvas>
        <color attach="background" args={[canvasColor]} />

        <Environment preset="dawn" />
        <Experience />
        {/* <fog attach="fog" args={[fogColor, 0, 50]} /> */}
      </Canvas>
    </>
  )
}

export default App
