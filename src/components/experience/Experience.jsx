import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { useAudio } from '@/contexts/AudioContext.jsx'
import MemoryGame from '@/components/experience/memoryGame/MemoryGame.jsx'
import Background from '@/components/experience/background/Background.jsx'

export default function Experience({ userClicked }) {
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
      <MemoryGame userClicked={userClicked} />
    </>
  )
}
