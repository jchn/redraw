import { rectangle } from './elements'

const elementTypes = {
  rectangle
}

function draw (ctx, vnode) {
  if (!vnode) return
  const { type, props, _children, _position, _dimensions } = vnode

  if (typeof type === 'string') {
    if (type in elementTypes) {
      elementTypes[type].draw(ctx, Object.assign({}, props, _position, _dimensions, { children: _children }))
    }
  }

  for (let i = 0; i < _children.length; i++) {
    draw(ctx, _children[i])
  }
}

export default draw
