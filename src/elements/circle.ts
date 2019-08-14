import withApplyStylesToCtx, { StyleObject } from './withApplyStylesToCtx'
import { vec2 } from 'gl-matrix'

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
  const position = vec2.fromValues(0, 0)

  vec2.transformMat2d(position, position, matrix)

  const p = new Path2D()
  p.arc(position[0] + radius, position[1] + radius, radius, 0, 2 * Math.PI)

  return p
}

export const draw = withApplyStylesToCtx(drawCircle)
