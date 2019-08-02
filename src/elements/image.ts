interface props {
  x: number
  y: number
  width: number
  height: number
  src: CanvasImageSource
}

export const draw = (ctx: CanvasRenderingContext2D, { x, y, width, height, src }: props) => {
  ctx.drawImage(src, x, y + y, width, height)
}
