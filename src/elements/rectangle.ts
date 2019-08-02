interface props {
  x: number,
  y: number,
  width: number,
  height: number
}

export const draw = (ctx: CanvasRenderingContext2D, { x, y, width, height }: props) => {
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.stroke()
}
