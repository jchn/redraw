import withApplyStylesToCtx, { StyleObject } from './withApplyStylesToCtx'
import { vec2 } from 'gl-matrix'

interface props {
  x: number
  y: number
  width: number
  height: number
  style?: StyleObject
  matrix: Float32Array
}

const drawRect = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, style, matrix }: props
) => {
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

  ctx.beginPath()

  ctx.moveTo(p1[0], p1[1])
  ctx.lineTo(p2[0], p2[1])
  ctx.lineTo(p3[0], p3[1])
  ctx.lineTo(p4[0], p4[1])
  ctx.lineTo(p1[0], p1[1])

  ctx.fill()
  if (style && style.lineWidth) ctx.stroke()
}

export const draw = withApplyStylesToCtx(drawRect)
