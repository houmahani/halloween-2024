import { useState, useRef, useEffect } from 'react'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { Html, Float, MeshPortalMaterial } from '@react-three/drei'
import { BackSide, Color, FrontSide, RepeatWrapping, Vector2 } from 'three'
import { geometry } from 'maath'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {
  cardsCount,
  horizontalGap,
  verticalGap,
  createInitialCards,
} from './cardsSetup'
import cardsVertexShader from '../materials/shaders/cards/vertex.glsl'
import cardsFragmentShader from '../materials/shaders/cards/fragment.glsl'
import { useMatchedElements } from '../MatchedElementsContext.jsx'

extend(geometry)

export default function MemoryGame() {
  const { matchedElements, addMatchedElement } = useMatchedElements()

  const cardRefs = useRef([])
  const cardMaterialRefs = useRef([])

  const [flippedCards, setFlippedCards] = useState([])
  const [hintText, setHintText] = useState('Turn over two cards to find pairs!')
  const [cardsState, setCardsState] = useState(() =>
    createInitialCards(cardsCount, horizontalGap, verticalGap)
  )

  const pumpkinsTexture = useLoader(TextureLoader, '/textures/pumpkins.png')

  const handleClick = (index) => {
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
    if (flippedCards.length === 1) {
      setHintText('Pick another card to see if they match.')
    } else if (flippedCards.length === 2) {
      setHintText('Checking if they match...')

      const [firstIndex, secondIndex] = flippedCards

      if (
        cardsState[firstIndex].element.name ===
        cardsState[secondIndex].element.name
      ) {
        setTimeout(() => {
          setHintText('Great job! You found a matching pair!')
          setFlippedCards([])

          addMatchedElement(cardsState[firstIndex].element.name)

          setTimeout(() => {
            const allMatched = cardsState.every((card) => card.flipped)
            if (allMatched) {
              setHintText('Congratulations! You matched all the pairs! 🎉')
            } else {
              setTimeout(() => {
                setHintText('Turn over two cards to find more pairs!')
              }, 1000)
            }
          }, 1500)
        }, 500)
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
          setHintText('No match, try again!')

          setTimeout(() => {
            setHintText('Turn over two cards to find more pairs!')
          }, 1500)
        }, 1000)
      }
    }
  }, [flippedCards])

  useFrame((state, delta) => {
    cardRefs.current.forEach((ref, i) => {
      if (ref) {
        const targetRotation = cardsState[i].flipped ? Math.PI : 0
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
                    uColor: { value: card.color },
                    uBackColor: { value: new Color('#351861') },
                    uLineColor: { value: new Color('#e46b00') },
                    uPumpkinsTexture: { value: pumpkinsTexture },
                    uXOffset: { value: card.offset[0] },
                    uYOffset: { value: card.offset[1] },
                    uTime: { value: 0 },
                    uStartOffset: { value: Math.random() },
                    uDirection: { value: Math.random() > 0.5 ? 1.0 : -1.0 },
                    uGlowCenter: { value: new Vector2(0.5, 0.5) },
                    uGlowRadius: { value: 2.0 },
                    uGlowIntensity: { value: 2.0 },
                  }}
                />
              </mesh>
            </group>
          </Float>
        )
      })}

      {/* <Html as="div" wrapperClass="wrapper__hint">
        <div className="hint">{hintText}</div>
      </Html> */}
    </>
  )
}
