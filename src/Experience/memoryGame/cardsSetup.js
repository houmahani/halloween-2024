import { Color } from 'three'

export const cardsCount = 8
export const horizontalGap = 1.5
export const verticalGap = 2.4

// Function to create initial card data
export const createInitialCards = (cardsCount, horizontalGap, verticalGap) => {
  const cards = []
  const colorPairs = []

  for (let i = 0; i < cardsCount / 2; i++) {
    const color = new Color(Math.random(), Math.random(), Math.random())
    colorPairs.push(color, color)
  }

  const shuffledColors = colorPairs.sort(() => Math.random() - 0.5)

  for (let i = 0; i < cardsCount; i++) {
    const x = (i % 4) * horizontalGap - ((4 - 1) * horizontalGap) / 2
    const y = Math.floor(i / 4) * verticalGap - ((2 - 1) * verticalGap) / 2

    const xOffset = (x + ((4 - 1) * horizontalGap) / 2) / (4 * horizontalGap)
    const yOffset = (y + ((2 - 1) * verticalGap) / 2) / (2 * verticalGap)

    cards.push({
      position: [x, y, 0.8],
      color: shuffledColors[i],
      flipped: false,
      offset: [xOffset, yOffset],
    })
  }

  return cards
}
