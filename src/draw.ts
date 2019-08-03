import { rectangle, text, image } from './elements'

const elementTypes = {
  rectangle,
  text,
  image
}

function draw (ctx, vnode, clear = true) {
  if (!vnode) return
  if (clear) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  const { type, props, _children, _position, _dimensions } = vnode

  if (typeof type === 'string') {
    if (type in elementTypes) {
      elementTypes[type].draw(ctx, Object.assign({}, props, _position, _dimensions, { children: _children }))
    }
  }

  if (!_children) return

  for (let i = 0; i < _children.length; i++) {
    draw(ctx, _children[i], false)
  }
}

export default draw
