import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [audioTriggered, setAudioTriggered] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/ambience.mp3')
    audioRef.current.load()
    audioRef.current.loop = true
    audioRef.current.volume = 0.5
  }, [])

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

export const useAudio = () => useContext(AudioContext)
