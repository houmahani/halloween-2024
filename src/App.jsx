import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { BlendFunction } from 'postprocessing'
import { Leva } from 'leva'
import {
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { MatchedElementsProvider } from './Experience/MatchedElementsContext.jsx'
import Experience from './Experience/Experience.jsx'
import Loader from './Loader.jsx'
import { PositionalAudio } from '@react-three/drei'

function App() {
  return (
    <>
      <Leva flat />

      <Canvas>
        <Suspense fallback={<Loader />}>
          <MatchedElementsProvider>
            <Experience />
          </MatchedElementsProvider>
        </Suspense>

        <EffectComposer>
          <ToneMapping
            blendFunction={BlendFunction.PIN_LIGHT}
            adaptive={true}
            resolution={1024}
            middleGrey={0.1}
            maxLuminance={3.5}
            averageLuminance={0}
            adaptationRate={0.2}
          />

          <Vignette
            offset={0.4}
            darkness={0.7}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </>
  )
}

export default App
