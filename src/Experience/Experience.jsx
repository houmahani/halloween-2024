import { Html, OrbitControls, PositionalAudio } from '@react-three/drei'
import { useControls } from 'leva'
import MemoryGame from './memoryGame/MemoryGame.jsx'
import Background from './background/Background.jsx'
import SoundManager, { useSoundControls } from './SoundManager.jsx'
import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../AudioContext.jsx'

export default function Experience({ ready }) {
  const { enableOrbitControls } = useControls('Behind the scene', {
    enableOrbitControls: false,
  })

  const { audioTriggered, setAudioTriggered } = useAudio()
  return (
    <>
      <OrbitControls enabled={enableOrbitControls} />
      <ambientLight intensity={10} color="#ffffff" />
      <Background
        onClick={() => setAudioTriggered(true)}
        audioTriggered={audioTriggered}
      />
      <MemoryGame />
    </>
  )
}
