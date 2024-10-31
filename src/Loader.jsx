import { Html, useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

const Loader = ({ setIsLoaded }) => {
  const { progress } = useProgress()

  useEffect(() => {
    if (progress === 100) {
      setIsLoaded(true)
    }
  }, [progress, setIsLoaded]) // Added showButton dependency here

  return (
    <Html center wrapperClass="loader-wrapper">
      <div className="loader">
        <p>{Math.floor(progress)}%</p>
      </div>
    </Html>
  )
}

export default Loader
