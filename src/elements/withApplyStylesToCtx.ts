export interface StyleObject {
  lineWidth?: number
  lineCap?: 'butt'|'round'|'square'
  lineDashOffset?: number[]
  fillStyle?: string
  strokeStyle?: string
  shadowBlur?: number
  shadowColor?: string
  shadowOffsetX?: number
  shadowOffsetY?: number
  opacity?: number
  textAlign?: 'left'|'right'|'center'|'start'|'end'
  textBaseline?: 'top'|'hanging'|'middle'|'alphabetic'|'ideographic'|'bottom'
  font?: string
  globalAlpha?: number
  lineJoin?: 'bevel'|'round'|'miter'
  miterLimit?: number
  filter?: string
  imageSmoothingEnabled?: boolean
  currentTransform?: any
}

const withApplyStylesToCtx = drawFn => (ctx: CanvasRenderingContext2D, props) => {
  if (!props.style) return drawFn(ctx, props)

  ctx.save()
  for (let key in props.style) {
    ctx[key] = props.style[key]
  }
  drawFn(ctx, props)
  ctx.restore()
  props.clip && ctx.clip()
}

export default withApplyStylesToCtx
