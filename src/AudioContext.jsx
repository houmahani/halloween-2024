import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'

// Create the AudioContext
const AudioContext = createContext()

export const useAudio = () => useContext(AudioContext)

export const AudioProvider = ({ children }) => {
  const [audioTriggered, setAudioTriggered] = useState(false)
  const audioRef = useRef(null)

  // Preload the audio when the component mounts
  useEffect(() => {
    audioRef.current = new Audio('/sounds/ambience.mp3')
    audioRef.current.load() // Preloads the audio
    audioRef.current.loop = true
    audioRef.current.volume = 0.5
  }, [])

  // Function to play audio
  const enableAudio = () => {
    if (audioRef.current && !audioTriggered) {
      setAudioTriggered(true)
      audioRef.current.play()
    }
  }

  return (
    <AudioContext.Provider value={{ audioTriggered, enableAudio }}>
      {children}
    </AudioContext.Provider>
  )
}
