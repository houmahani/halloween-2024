import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { BlendFunction } from 'postprocessing'
import { Leva } from 'leva'
import {
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { AudioProvider } from '@/contexts/AudioContext.jsx'
import { MemoryGameContextProvider } from '@/contexts/MemoryGameContext.jsx'
import Experience from '@/components/Experience/Experience.jsx'
import Loader from '@/components/Loader.jsx'
import Intro from '@/components/Intro.jsx'
import Footer from '@/components/Footer.jsx'
import '@/style/app.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [userClicked, setUserClicked] = useState(false)

  const handleUserClick = () => setUserClicked(true)
  return (
    <>
      <Leva flat collapsed hidden={!isLoaded || !userClicked} />

      <Canvas>
        <Suspense fallback={<Loader setIsLoaded={setIsLoaded} />}>
          <AudioProvider>
            <MemoryGameContextProvider>
              <Experience userClicked={userClicked} />
              <Intro
                isLoaded={isLoaded}
                userClicked={userClicked}
                handleUserClick={handleUserClick}
              />
            </MemoryGameContextProvider>
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

      <Footer />
    </>
  )
}

export default App
