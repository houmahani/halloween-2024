import React, { createContext, useContext, useEffect, useState } from 'react'

const MatchedElementsContext = createContext()

export const MatchedElementsProvider = ({ children }) => {
  const [matchedElements, setMatchedElements] = useState([])
  const [audioTriggered, setAudioTriggered] = useState(false)

  const addMatchedElement = (element) => {
    setMatchedElements((prev) => {
      if (!prev.includes(element)) {
        return [...prev, element]
      }
      return prev
    })
  }

  useEffect(() => {
    const handleClick = () => {
      setAudioTriggered(true)
    }

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [audioTriggered])

  return (
    <MatchedElementsContext.Provider
      value={{
        matchedElements,
        addMatchedElement,
        audioTriggered,
        setAudioTriggered,
      }}
    >
      {children}
    </MatchedElementsContext.Provider>
  )
}

export const useMatchedElements = () => useContext(MatchedElementsContext)
