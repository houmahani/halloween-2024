import { useState, useRef, useEffect } from 'react'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { Html, Float, MeshPortalMaterial } from '@react-three/drei'
import { BackSide, Color, FrontSide } from 'three'
import { geometry } from 'maath'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {
  cardsCount,
  horizontalGap,
  verticalGap,
  createInitialCards,
} from './cardsSetup'
import cardsVertexShader from '@/components/experience/materials/shaders/cards/vertex.glsl'
import cardsFragmentShader from '@/components/experience/materials/shaders/cards/fragment.glsl'
import { useMemoryGameContext } from '@/contexts/MemoryGameContext.jsx'

extend(geometry)

export default function MemoryGame({ userClicked }) {
  const {
    matchedElements,
    setMatchedElements,
    addMatchedElement,
    userHasWon,
    setUserHasWon,
    resetGame,
    setResetGame,
  } = useMemoryGameContext()

  const cardRefs = useRef([])
  const cardMaterialRefs = useRef([])
  const [flippedCards, setFlippedCards] = useState([])
  const [cardsState, setCardsState] = useState(() =>
    createInitialCards(cardsCount, horizontalGap, verticalGap)
  )

  const pumpkinsTexture = useLoader(TextureLoader, '/textures/pumpkins.png')

  const handleClick = (index) => {
    if (!userClicked) return
    if (flippedCards.length === 2 || cardsState[index].flipped) {
      return
    }

    setCardsState((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, flipped: !card.flipped } : card
      )
    )

    setFlippedCards((prevFlipped) => [...prevFlipped, index])
  }

  useEffect(() => {
    if (resetGame) {
      setMatchedElements([])
      setCardsState(createInitialCards(cardsCount, horizontalGap, verticalGap)) // Regenerate shuffled cards

      setCardsState((prevCards) =>
        prevCards.map((card) => ({ ...card, flipped: false }))
      )

      setResetGame(false)
    }
  }, [resetGame, setMatchedElements])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards

      if (
        cardsState[firstIndex].element.name ===
        cardsState[secondIndex].element.name
      ) {
        setFlippedCards([])

        addMatchedElement(cardsState[firstIndex].element.name)

        const allMatched = cardsState.every((card) => card.flipped)

        if (allMatched) {
          setUserHasWon(true)
        } else {
          setUserHasWon(false)
        }
      } else {
        setTimeout(() => {
          setCardsState((prevCards) =>
            prevCards.map((card, i) =>
              i === firstIndex || i === secondIndex
                ? { ...card, flipped: false }
                : card
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards])

  const handlePlayAgain = () => {
    setResetGame(true)
    setUserHasWon(false)
  }

  useFrame((_state, delta) => {
    cardRefs.current.forEach((ref, i) => {
      if (ref && !resetGame) {
        const targetRotation = cardsState[i].flipped ? Math.PI : 0
        ref.rotation.y += (targetRotation - ref.rotation.y) * delta * 4
      } else if (ref && resetGame) {
        const targetRotation = cardsState[i].flipped ? 0 : Math.PI
        ref.rotation.y += (targetRotation - ref.rotation.y) * delta * 4
      }
    })

    cardMaterialRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.uniforms.uTime.value += delta
      }
    })
  })

  return (
    <>
      {cardsState.map((card, index) => {
        const PortalSceneComponent = card.element.scene

        return (
          <Float
            key={index}
            speed={2}
            rotationIntensity={0.01}
            floatIntensity={0.1}
            floatingRange={[-0.5, 0.5]}
          >
            <group
              key={index}
              ref={(card) => (cardRefs.current[index] = card)}
              position={card.position}
              onClick={() => handleClick(index)}
              onPointerEnter={() => {
                if (!userClicked) return

                document.body.classList.add('selected')
                document.body.classList.remove('auto')
              }}
              onPointerLeave={() => {
                document.body.classList.remove('selected')
                document.body.classList.add('auto')
              }}
            >
              <mesh>
                <roundedPlaneGeometry args={[1.2, 2, 0.1]} />

                {/* Front side - Portal Material */}
                <MeshPortalMaterial side={BackSide} attachArray="material">
                  <PortalSceneComponent matchedElements={matchedElements} />
                </MeshPortalMaterial>
              </mesh>

              <mesh>
                <roundedPlaneGeometry args={[1.2, 2, 0.1]} />

                {/* Back side */}
                <shaderMaterial
                  attachArray="material"
                  ref={(card) => (cardMaterialRefs.current[index] = card)}
                  vertexShader={cardsVertexShader}
                  fragmentShader={cardsFragmentShader}
                  side={FrontSide}
                  transparent={false}
                  uniforms={{
                    uTime: { value: 0 },
                    uXOffset: { value: card.offset[0] },
                    uYOffset: { value: card.offset[1] },
                    uColor: { value: card.color },
                    uBackColor: { value: new Color('#351861') },
                    uLineColor: { value: new Color('#e46b00') },
                    uPumpkinsTexture: { value: pumpkinsTexture },
                  }}
                />
              </mesh>
            </group>
          </Float>
        )
      })}

      {userHasWon && (
        <Html as="div" wrapperClass="wrapper">
          <button onClick={handlePlayAgain}>Play again</button>
        </Html>
      )}
    </>
  )
}
