import withApplyStylesToCtx, { StyleObject } from "./withApplyStylesToCtx"

interface props {
  x: number,
  y: number,
  width: number,
  height: number,
  style?: StyleObject
}

const drawRect = (ctx: CanvasRenderingContext2D, { x, y, width, height, style }: props) => {
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.fill()
  if (style && style.lineWidth) ctx.stroke()
}

export const draw = withApplyStylesToCtx(drawRect)
