import { rectangle, text, image, circle } from './elements'

const elementTypes = {
  rectangle,
  text,
  image,
  circle,
}

function draw(ctx, vnode, clear = true) {
  if (!vnode) return
  if (clear) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  const { type, _children } = vnode

  ctx.save()

  if (typeof type === 'string') {
    if (type in elementTypes) {
      vnode._path = elementTypes[type].createPath(vnode)
      elementTypes[type].draw(ctx, vnode)
    }
  }

  if (!_children) {
    ctx.restore()
    return
  }

  for (let i = 0; i < _children.length; i++) {
    draw(ctx, _children[i], false)
    i + 1 === _children.length && ctx.restore()
  }
}

export default draw
