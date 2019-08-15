import withApplyStylesToCtx from './withApplyStylesToCtx'
import { vec2 } from '../matrix'

interface props {
  x: number
  y: number
  width: number
  fontSize: number
  fontFamily?: string
  lineHeight?: number
  children: string[]
}

const drawText = (ctx: CanvasRenderingContext2D, vnode) => {
  const { fontSize, fontFamily, width, lineHeight = 1 } = vnode.props
  const children = vnode._children
  const matrix = vnode._matrix

  const position = vec2.fromValues(0, 0)

  vec2.transformMat2d(position, position, matrix)

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

  ctx.transform.apply(ctx, matrix)

  lines.forEach((line, i) => {
    ctx.fillText(line.join(' '), 0, 0 + fontSize * i * lineHeight + fontSize)
  })
}

export const createPath = vnode => {
  const matrix = vnode._matrix
  const { width, height } = vnode.props

  const p = new Path2D()

  const x1 = 0
  const y1 = 0

  const p1 = vec2.fromValues(x1, y1)
  const p2 = vec2.fromValues(x1 + width, y1)
  const p3 = vec2.fromValues(x1 + width, y1 + height)
  const p4 = vec2.fromValues(x1, y1 + height)

  vec2.transformMat2d(p1, p1, matrix)
  vec2.transformMat2d(p2, p2, matrix)
  vec2.transformMat2d(p3, p3, matrix)
  vec2.transformMat2d(p4, p4, matrix)

  p.moveTo(p1[0], p1[1])
  p.lineTo(p2[0], p2[1])
  p.lineTo(p3[0], p3[1])
  p.lineTo(p4[0], p4[1])
  p.lineTo(p1[0], p1[1])
  p.closePath()

  return p
}

export const setAnchor = vnode => {
  // no-op for now, bounding box is dependant on text
}

export const draw = withApplyStylesToCtx(drawText)
