import withApplyStylesToCtx, { StyleObject } from './withApplyStylesToCtx'
import { vec2, mat2d } from '../matrix'

interface props {
  x: number
  y: number
  width: number
  height: number
  style?: StyleObject
  matrix: Float32Array
  path: Path2D
}

const drawRect = (ctx: CanvasRenderingContext2D, vnode) => {
  const style = vnode.props.style
  const path = vnode._path

  ctx.stroke(path)

  ctx.fill(path)
  if (style && style.lineWidth) ctx.stroke(path)
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
  const matrix = vnode._matrix
  const { width, height, anchor = [0, 0] } = vnode.props

  const offsetX = -width * anchor[0]
  const offsetY = -height * anchor[1]

  mat2d.translate(matrix, matrix, vec2.fromValues(offsetX, offsetY))
}

export const draw = withApplyStylesToCtx(drawRect)
