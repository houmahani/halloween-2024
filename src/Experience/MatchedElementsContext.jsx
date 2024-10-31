import React, { createContext, useContext, useEffect, useState } from 'react'

const MatchedElementsContext = createContext()

export const MatchedElementsProvider = ({ children }) => {
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
    <MatchedElementsContext.Provider
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
    </MatchedElementsContext.Provider>
  )
}

export const useMatchedElements = () => useContext(MatchedElementsContext)
