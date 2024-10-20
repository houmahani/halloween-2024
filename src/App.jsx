import { Canvas } from '@react-three/fiber'
import { BlendFunction } from 'postprocessing'
import {
  Cloud,
  Clouds,
  Environment,
  Grid,
  PresentationControls,
} from '@react-three/drei'
import { Leva, useControls } from 'leva'
import Experience from './Experience/Experience.jsx'

import './App.css'
import { MeshLambertMaterial } from 'three'
import {
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  ColorAverage,
  DepthOfField,
  DotScreen,
  EffectComposer,
  Glitch,
  GodRays,
  HueSaturation,
  Noise,
  Scanline,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'

function App() {
  const { canvasColor } = useControls('Canvas Background', {
    canvasColor: '#06162a',
  })

  const { fogColor } = useControls('Fog Color', {
    fogColor: '#000810',
  })

  return (
    <>
      <Leva flat />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}
      >
        {/* <color attach="background" args={[canvasColor]} /> */}

        <Experience />

        <EffectComposer>
          {/* <BrightnessContrast
            brightness={-0.2} // brightness. min: -1, max: 1
            contrast={0} // contrast: min -1, max: 1
          /> */}
          <ToneMapping
            blendFunction={BlendFunction.PIN_LIGHT} // blend mode
            adaptive={true} // toggle adaptive luminance map usage
            resolution={256} // texture resolution of the luminance map
            middleGrey={0.1} // middle grey factor
            maxLuminance={1.5} // maximum luminance
            averageLuminance={0} // average luminance
            adaptationRate={0.2} // luminance adaptation rate
          />

          <Vignette
            offset={0.5} // vignette offset
            darkness={0.5} // vignette darkness
            eskil={false} // Eskil's vignette technique
            blendFunction={BlendFunction.NORMAL} // blend mode
          />
        </EffectComposer>
      </Canvas>
    </>
  )
}

export default App
