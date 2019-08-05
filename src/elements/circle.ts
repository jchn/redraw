import withApplyStylesToCtx, { StyleObject } from "./withApplyStylesToCtx"

interface props {
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  style?: StyleObject
}

const drawCircle = (ctx: CanvasRenderingContext2D, { x, y, width, height, radius, style }: props) => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill()
  if (style && style.lineWidth) ctx.stroke()
}

export const draw = withApplyStylesToCtx(drawCircle)
