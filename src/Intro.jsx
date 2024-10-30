import { Suspense, cloneElement, useEffect, useState } from 'react'

function Ready({ setReady }) {
  useEffect(() => {
    setReady(true) // Set ready to true once Suspense exits fallback
  }, [setReady])
  return null
}

export default function Intro({ children }) {
  const [clicked, setClicked] = useState(false)
  const [ready, setReady] = useState(false)
  return (
    <>
      <Suspense fallback={<Ready setReady={setReady} />}>
        {cloneElement(children, { ready: clicked && ready })}
      </Suspense>
      <div
        className={`fullscreen bg ${ready ? 'ready' : 'notready'} ${clicked && 'clicked'}`}
      >
        <div className="stack">
          <a href="#" onClick={() => setClicked(true)}>
            {!ready ? 'loading' : 'click to continue'}
          </a>
        </div>
      </div>
    </>
  )
}
