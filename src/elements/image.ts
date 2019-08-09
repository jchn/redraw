import withApplyStylesToCtx, { StyleObject } from './withApplyStylesToCtx'

interface props {
  x: number
  y: number
  width: number
  height: number
  src: CanvasImageSource
  style?: StyleObject
}

const drawImage = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, src }: props
) => {
  ctx.drawImage(src, x, y, width, height)
}

export const draw = withApplyStylesToCtx(drawImage)
