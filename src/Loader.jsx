import { Html, useProgress } from '@react-three/drei'
import { useState } from 'react'

const Loader = () => {
  const { progress } = useProgress()

  return (
    <Html center wrapperClass="loader-wrapper">
      <div className="loader">
        <p>loading the experience</p>
        <div className="progress-bar">
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#d43c05',
            }}
          />
        </div>
      </div>
    </Html>
  )
}

export default Loader
