export interface StyleObject {
  lineWidth?: number
  lineCap?: 'butt' | 'round' | 'square'
  lineDashOffset?: number[]
  fillStyle?: string
  strokeStyle?: string
  shadowBlur?: number
  shadowColor?: string
  shadowOffsetX?: number
  shadowOffsetY?: number
  opacity?: number
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end'
  textBaseline?:
    | 'top'
    | 'hanging'
    | 'middle'
    | 'alphabetic'
    | 'ideographic'
    | 'bottom'
  font?: string
  globalAlpha?: number
  lineJoin?: 'bevel' | 'round' | 'miter'
  miterLimit?: number
  filter?: string
  imageSmoothingEnabled?: boolean
  currentTransform?: any
}

const withApplyStylesToCtx = drawFn => (
  ctx: CanvasRenderingContext2D,
  vnode
) => {
  const props = vnode.props
  if (!props.style) return drawFn(ctx, props)

  for (let key in props.style) {
    ctx[key] = props.style[key]
  }
  drawFn(ctx, vnode)
}

export default withApplyStylesToCtx
