import withApplyStylesToCtx, { StyleObject } from './withApplyStylesToCtx'
import { vec2, mat2d } from '../matrix'

interface props {
  x: number
  y: number
  width: number
  height: number
  radius: number
  style?: StyleObject
}

const drawCircle = (ctx: CanvasRenderingContext2D, vnode) => {
  const style = vnode.props.style
  const path = vnode._path

  ctx.stroke(path)

  ctx.fill(path)
  if (style && style.lineWidth) ctx.stroke(path)
}

export const createPath = vnode => {
  const matrix = vnode._matrix
  const { radius } = vnode.props
  const p1 = vec2.fromValues(radius, 0)
  const p2 = vec2.fromValues(radius * 2, radius)
  const p3 = vec2.fromValues(radius, radius * 2)
  const p4 = vec2.fromValues(0, radius)

  const points = [p1, p2, p3, p4]

  // from: https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
  const k = (4 / 3) * Math.tan(Math.PI / 8)

  const offset = radius * k

  const h1 = vec2.fromValues(p1[0] + offset, p1[1])
  const h2 = vec2.fromValues(p2[0], p2[1] - offset)
  const h3 = vec2.fromValues(p2[0], p2[1] + offset)
  const h4 = vec2.fromValues(p3[0] + offset, p3[1])
  const h5 = vec2.fromValues(p3[0] - offset, p3[1])
  const h6 = vec2.fromValues(p4[0], p4[1] + offset)
  const h7 = vec2.fromValues(p4[0], p4[1] - offset)
  const h8 = vec2.fromValues(p1[0] - offset, p1[1])

  const handles = [h1, h2, h3, h4, h5, h6, h7, h8]

  points.forEach(point => {
    vec2.transformMat2d(point, point, matrix)
  })

  handles.forEach(handle => {
    vec2.transformMat2d(handle, handle, matrix)
  })

  const p = new Path2D()
  p.moveTo(p1[0], p1[1])

  p.bezierCurveTo(h1[0], h1[1], h2[0], h2[1], p2[0], p2[1])
  p.bezierCurveTo(h3[0], h3[1], h4[0], h4[1], p3[0], p3[1])
  p.bezierCurveTo(h5[0], h5[1], h6[0], h6[1], p4[0], p4[1])
  p.bezierCurveTo(h7[0], h7[1], h8[0], h8[1], p1[0], p1[1])

  return p
}

export const setAnchor = vnode => {
  const matrix = vnode._matrix
  const { radius, anchor = [0, 0] } = vnode.props

  const offsetX = -radius * 2 * anchor[0]
  const offsetY = -radius * 2 * anchor[1]

  mat2d.translate(matrix, matrix, vec2.fromValues(offsetX, offsetY))
}

export const draw = withApplyStylesToCtx(drawCircle)
