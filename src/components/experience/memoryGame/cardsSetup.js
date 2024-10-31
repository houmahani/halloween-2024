import { Color } from 'three'
import PumpkinScene from '@/components/experience/memoryGame/portals/PumpkinScene.jsx'
import BatScene from '@/components/experience/memoryGame//portals/BatScene.jsx'
import CandleScene from '@/components/experience/memoryGame/portals/SkullCandleScene.jsx'
import PotionScene from '@/components/experience/memoryGame/portals/EyeBallScene.jsx'

export const cardsCount = 8
export const horizontalGap = 1.5
export const verticalGap = 2.4

export const portalScenes = [
  { name: 'pumpkin', scene: PumpkinScene },
  { name: 'bats', scene: BatScene },
  { name: 'candle', scene: CandleScene },
  { name: 'eyeball', scene: PotionScene },
]

export const createInitialCards = (cardsCount, horizontalGap, verticalGap) => {
  const cards = []
  const elementPairs = []

  portalScenes.forEach((portalScene) => {
    elementPairs.push(portalScene, portalScene)
  })

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
