import { Canvas } from '@react-three/fiber'
import { BlendFunction } from 'postprocessing'
import {
  Cloud,
  Clouds,
  Environment,
  Grid,
  Loader,
  OrthographicCamera,
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
import { MatchedElementsProvider } from './Experience/MatchedElementsContext.jsx'
import { Suspense } from 'react'

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

      <Canvas shadows dpr={[1, 1.5]}>
        {/* <color attach="background" args={[canvasColor]} /> */}
        {/* <OrthographicCamera
          makeDefault
          position={[0, 0, 100]} // Position to ensure the camera is looking at your scene
          zoom={1} // Set a zoom level to make sure everything fits comfortably
          left={-window.innerWidth / 100}
          right={window.innerWidth / 100}
          top={window.innerHeight / 100}
          bottom={-window.innerHeight / 100}
          near={0.1}
          far={1000}
        /> */}

        <Suspense>
          <MatchedElementsProvider>
            <Experience />
          </MatchedElementsProvider>

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
        </Suspense>
      </Canvas>

      <Loader />
    </>
  )
}

export default App
