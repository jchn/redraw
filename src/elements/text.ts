import withApplyStylesToCtx from './withApplyStylesToCtx'

interface props {
  x: number
  y: number
  width: number
  fontSize: number
  fontFamily?: string
  lineHeight?: number
  children: string[]
}

const drawText = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, fontSize, fontFamily, lineHeight = 1, children }: props
) => {
  ctx.font = `${fontSize}px ${fontFamily || 'sans-serif'}`
  const lines = children[0].split(' ').reduce(
    (lines: string[][], word) => {
      const lastLine = lines[lines.length - 1]
      const size = ctx.measureText(lastLine.concat([word]).join(' '))

      if (size.width < width || lastLine.length === 0) {
        lastLine.push(word)
      } else {
        lines.push([word])
      }

      return lines
    },
    [[]]
  )

  lines.forEach((line, i) => {
    ctx.fillText(line.join(' '), x, y + fontSize * i * lineHeight + fontSize)
  })
}

export const draw = withApplyStylesToCtx(drawText)
