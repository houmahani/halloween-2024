import { useState, useRef, useEffect } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import { DoubleSide } from 'three'
import { geometry } from 'maath'
import {
  cardsCount,
  horizontalGap,
  verticalGap,
  createInitialCards,
} from './cardsSetup'
import cardsVertexShader from '../materials/shaders/cards/vertex.glsl'
import cardsFragmentShader from '../materials/shaders/cards/fragment.glsl'

extend(geometry)

export default function MemoryGame() {
  const cardRefs = useRef([])
  const [flippedCards, setFlippedCards] = useState([])
  const [hintText, setHintText] = useState('Turn over two cards to find pairs!')

  const [cardsState, setCardsState] = useState(() =>
    createInitialCards(cardsCount, horizontalGap, verticalGap)
  )

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

      if (cardsState[firstIndex].color.equals(cardsState[secondIndex].color)) {
        setTimeout(() => {
          setHintText('Great job! You found a matching pair!')

          setFlippedCards([])

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
  })

  return (
    <>
      {cardsState.map((card, index) => {
        return (
          <Float
            key={index}
            speed={3}
            rotationIntensity={0.01}
            floatIntensity={0.1}
            floatingRange={[-0.5, 0.5]}
          >
            <mesh
              key={index}
              ref={(card) => (cardRefs.current[index] = card)}
              onClick={() => handleClick(index)}
              position={card.position}
            >
              <roundedPlaneGeometry args={[1.8, 2.8, 0.1]} />
              <shaderMaterial
                vertexShader={cardsVertexShader}
                fragmentShader={cardsFragmentShader}
                side={DoubleSide}
                uniforms={{
                  uColor: { value: card.color },
                }}
              />
            </mesh>
          </Float>
        )
      })}

      <Html as="div" wrapperClass="wrapper__hint">
        <div className="hint">{hintText}</div>
      </Html>
    </>
  )
}
