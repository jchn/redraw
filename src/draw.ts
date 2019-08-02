import { rectangle, text } from './elements'

const elementTypes = {
  rectangle,
  text
}

function draw (ctx, vnode) {
  if (!vnode) return
  const { type, props, _children, _position, _dimensions } = vnode

  if (typeof type === 'string') {
    if (type in elementTypes) {
      elementTypes[type].draw(ctx, Object.assign({}, props, _position, _dimensions, { children: _children }))
    }
  }

  if (!_children) return

  for (let i = 0; i < _children.length; i++) {
    draw(ctx, _children[i])
  }
}

export default draw
