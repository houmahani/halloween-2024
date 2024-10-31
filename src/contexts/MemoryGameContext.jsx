import React, { createContext, useContext, useState } from 'react'

const MemoryGameContext = createContext()

export const MemoryGameContextProvider = ({ children }) => {
  const [matchedElements, setMatchedElements] = useState([])
  const [userHasWon, setUserHasWon] = useState(false)

  const [resetGame, setResetGame] = useState(false)

  const addMatchedElement = (element) => {
    setMatchedElements((prev) => {
      if (!prev.includes(element)) {
        return [...prev, element]
      }
      return prev
    })
  }

  return (
    <MemoryGameContext.Provider
      value={{
        matchedElements,
        setMatchedElements,
        addMatchedElement,
        userHasWon,
        setUserHasWon,
        resetGame,
        setResetGame,
      }}
    >
      {children}
    </MemoryGameContext.Provider>
  )
}

export const useMemoryGameContext = () => useContext(MemoryGameContext)
