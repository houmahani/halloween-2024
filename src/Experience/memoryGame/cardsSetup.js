import { Color } from 'three'
import PumpkinScene from '../scenes/PumpkinScene.jsx'
import BatScene from '../scenes/BatScene.jsx'
import CandleScene from '../scenes/CandleScene.jsx'
import PotionScene from '../scenes/PotionScene.jsx'

export const cardsCount = 8
export const horizontalGap = 1.5
export const verticalGap = 2.4

export const portalScenes = [
  { name: 'pumpkin', scene: PumpkinScene },
  { name: 'bats', scene: BatScene },
  { name: 'candle', scene: CandleScene },
  { name: 'potion', scene: PotionScene },
]

// Function to create initial card data
export const createInitialCards = (cardsCount, horizontalGap, verticalGap) => {
  const cards = []
  const elementPairs = []

  // Assign each element twice (for pairing)
  portalScenes.forEach((portalScene) => {
    elementPairs.push(portalScene, portalScene)
  })

  // Shuffle the element pairs
  const shuffledElements = elementPairs.sort(() => Math.random() - 0.5)

  for (let i = 0; i < cardsCount; i++) {
    const x = (i % 4) * horizontalGap - ((4 - 1) * horizontalGap) / 2
    const y = Math.floor(i / 4) * verticalGap - ((2 - 1) * verticalGap) / 2

    const xOffset = (x + ((4 - 1) * horizontalGap) / 2) / (4 * horizontalGap)
    const yOffset = (y + ((2 - 1) * verticalGap) / 2) / (2 * verticalGap)

    cards.push({
      position: [x, y, 0.8],
      color: new Color(Math.random(), Math.random(), Math.random()),
      element: shuffledElements[i],
      flipped: false,
      offset: [xOffset, yOffset],
    })
  }

  return cards
}
