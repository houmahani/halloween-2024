import { forwardRef, useEffect } from 'react'
import { PositionalAudio } from '@react-three/drei'

const SoundManager = forwardRef(({ sounds }, ref) => (
  <group ref={ref}>
    {sounds.map(
      ({ name, file, position = [0, 0, 0], loop = false, volume = 1 }) => (
        <PositionalAudio
          key={name}
          ref={(audioRef) => {
            if (audioRef) {
              ref.current[name] = audioRef // Store each audio in soundRefs by name
            }
          }}
          url={file}
          distance={10}
          loop={loop}
          volume={volume}
          position={position}
        />
      )
    )}
  </group>
))

export default SoundManager

// Custom hook to control playback for SoundManager
export function useSoundControls(soundRefs) {
  const playSound = (name) => {
    const sound = soundRefs.current[name]
    if (sound && !sound.isPlaying) {
      sound.play()
    }
  }

  const pauseSound = (name) => {
    const sound = soundRefs.current[name]
    if (sound && sound.isPlaying) {
      sound.pause()
    }
  }

  const stopSound = (name) => {
    const sound = soundRefs.current[name]
    if (sound && sound.isPlaying) {
      sound.stop()
    }
  }

  return { playSound, pauseSound, stopSound }
}
