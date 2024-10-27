import React, { createContext, useContext, useState } from 'react'

// Create context
const MatchedElementsContext = createContext()

// Provider component
export const MatchedElementsProvider = ({ children }) => {
  const [matchedElements, setMatchedElements] = useState([])

  // Function to add a new matched element
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
      value={{ matchedElements, addMatchedElement }}
    >
      {children}
    </MatchedElementsContext.Provider>
  )
}

// Custom hook to consume the context
export const useMatchedElements = () => useContext(MatchedElementsContext)
