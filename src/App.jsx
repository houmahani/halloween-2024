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
import { AudioProvider } from './AudioContext.jsx'
import Intro from './Intro.jsx'
import Info from './Info.jsx'

function App() {
  const [isLoaded, setIsLoaded] = useState(false) // Tracks if loading is complete
  const [userClicked, setUserClicked] = useState(false) // Tracks if user clicked "Enter Experience"

  // Click handler for the button
  const handleUserClick = () => setUserClicked(true)
  return (
    <>
      <Leva flat collapsed hidden={!isLoaded || !userClicked} />

      <Canvas>
        <Suspense fallback={<Loader setIsLoaded={setIsLoaded} />}>
          <AudioProvider>
            <MatchedElementsProvider>
              <Experience userClicked={userClicked} />
              <Intro
                isLoaded={isLoaded}
                userClicked={userClicked}
                handleUserClick={handleUserClick}
              />
            </MatchedElementsProvider>
          </AudioProvider>
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

      <Info />
    </>
  )
}

export default App
