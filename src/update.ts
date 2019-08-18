import { deg2rad, shallowDiffers } from './utils'
import { renderComponent, unmount } from './hooks'
import draw from './draw'
import { rectangle, image, circle, text } from './elements'
import { vec2, mat2d } from './matrix'

const elementTypes = {
  rectangle,
  image,
  circle,
  text,
}

let nodes: any[] = []
let ctx: CanvasRenderingContext2D

function Component(props) {
  // @ts-ignore
  this.props = props
}

Component.prototype.update = function(all) {
  const newVNode = Object.assign({}, this._vnode)
  Object.assign(this._vnode, update(newVNode, this._vnode))

  // redraw entire canvas for now, should only be this._vnode in the future
  draw(ctx, currentVNode)
  // draw(ctx, this._vnode)
  // if (all) {
  //   console.log('update entrire canvas for', this)
  // } else {
  //   console.log('update', this)
  // }
}

function doRender(props) {
  // @ts-ignore
  return this.constructor(props)
}

function getLastKnownMatrix(vnode) {
  if (vnode._parent && vnode._parent._matrix) {
    return vnode._parent._matrix
  } else if (vnode._parent) {
    return getLastKnownMatrix(vnode._parent)
  } else {
    return mat2d.create()
  }
}

function update(newVNode, oldVNode) {
  const newType = newVNode.type
  const newProps = newVNode.props
  let tmp

  if (typeof newType === 'function') {
    let c

    if (oldVNode && oldVNode._component) {
      c = newVNode._component = oldVNode._component
    } else {
      newVNode._component = c = new Component(newProps)
      c.constructor = newType
      c.render = doRender
      c._vnode = newVNode
    }

    renderComponent(c)
    tmp = c.render(newProps)

    newVNode._children = toChildArray(tmp) // probably have to do some sanitizing on this value
  } else {
    const parentMatrix = getLastKnownMatrix(newVNode)
    newVNode._dimensions = { width: newProps.width, height: newProps.height }

    if (!newVNode._matrix) {
      newVNode._matrix = mat2d.create()
    }

    mat2d.copy(newVNode._matrix, parentMatrix)

    mat2d.translate(
      newVNode._matrix,
      newVNode._matrix,
      vec2.fromValues(newProps.x, newProps.y)
    )

    if (newProps.rotate)
      mat2d.rotate(newVNode._matrix, newVNode._matrix, deg2rad(newProps.rotate))

    // needed for anchor point and updates the matrix, each element knows how to calculate its bounding box
    // [0, 0] sets anchor to top-left, [1, 1] sets anchor to bottom-right
    if (newProps.anchor) elementTypes[newType].setAnchor(newVNode)

    if (oldVNode && oldVNode._path) newVNode._path = oldVNode._path

    // nodes.push(newVNode)
    newVNode._children = toChildArray(newVNode.props.children)
  }
  updateChildren(newVNode, oldVNode)

  return newVNode
}

let count = 0

function mountVNode(vnode) {
  // console.log(count++)
  if (vnode.type in elementTypes)
    vnode._path = elementTypes[vnode.type].createPath(vnode)
  nodes.push(vnode)
}

function unmountVNode(vnode) {
  let idx = nodes.indexOf(vnode)
  if (idx !== -1) {
    nodes.splice(idx, 1)
  } else {
    console.warn('cannot remove', vnode)
  }

  unmount(vnode)

  if (vnode._children && vnode._children.length) {
    for (let i = 0; i < vnode._children.length; i++) {
      unmountVNode(vnode._children[i])
    }
  }
}

function vnodeUpdated(newVNode, oldVNode) {
  let idx = nodes.indexOf(oldVNode)
  if (idx !== -1) {
    nodes.splice(idx, 1)
  } else {
    console.warn('could not remove', newVNode)
  }

  nodes.push(newVNode)
}

function updateChildren(newParentVNode, oldParentVNode) {
  let newChild, oldChild
  let newChildren = newParentVNode._children
  let oldChildren =
    oldParentVNode && oldParentVNode._children ? oldParentVNode._children : []

  if (!newChildren) return

  if (newParentVNode.type === 'text' && Array.isArray(newChildren)) {
    newChildren = newParentVNode._children = [newChildren.join(' ')]
  }

  let i
  for (i = 0; i < newChildren.length; i++) {
    newChild = newChildren[i]
    oldChild = oldChildren[i]

    if (newChild === null || typeof newChild === 'string') continue

    if (oldChild && shallowDiffers(newChild.props, oldChild.props)) {
      vnodeUpdated(newChild, oldChild)
    }

    newChild._parent = newParentVNode
    newChild._depth = newParentVNode._depth + 1

    update(newChild, oldChild)
  }

  if (i < oldChildren.length) {
    for (let j = i; j < oldChildren.length; j++) {
      unmountVNode(oldChildren[j])
    }
  }

  if (i > oldChildren.length) {
    for (let j = oldChildren.length; j < i; j++) {
      mountVNode(newChildren[j])
    }
  }

  // if props changed, the component should be updated in nodes
}

let canvasClientRect

const flatten = arr => {
  if (!Array.isArray(arr)) return arr

  let curr,
    output: any[] = []
  for (let i = 0; i < arr.length; i++) {
    curr = arr[i]

    if (Array.isArray(curr)) {
      curr.forEach(el => output.push(el))
    } else {
      output.push(curr)
    }
  }

  if (output.some(el => Array.isArray(el))) {
    return flatten(output)
  } else {
    return output
  }
}

const isNotNull = arg => arg !== null

function toChildArray(vnode: {} | []) {
  if (!vnode) return []

  if (!Array.isArray(vnode)) {
    return [vnode].filter(isNotNull)
  } else {
    return flatten(vnode).filter(isNotNull)
  }
}

export default update

// Events

const setupListeners = () => {
  const eventTypeToPropName = {
    click: 'onClick',
    dblclick: 'onDoubleClick',
    mouseup: 'onMouseUp',
    mousedown: 'onMouseDown',
    mousemove: 'onMouseMove',

    touchstart: 'onTouchStart',
    touchend: 'onTouchEnd',
    touchcancel: 'onTouchCancel',
    touchmove: 'onTouchMove',
  }

  function mouseEventHandler(e: MouseEvent) {
    const { type, offsetX, offsetY } = e
    let n
    for (let i = 0; i < nodes.length; i++) {
      n = nodes[i]
      if (n._path && ctx.isPointInPath(n._path, offsetX, offsetY)) {
        if (eventTypeToPropName[type] in n.props) {
          n.props[eventTypeToPropName[type]](e)
          break
        }
      }
    }
  }

  ctx.canvas.addEventListener('click', mouseEventHandler)
  ctx.canvas.addEventListener('dblclick', mouseEventHandler)
  ctx.canvas.addEventListener('mouseup', mouseEventHandler)
  ctx.canvas.addEventListener('mousedown', mouseEventHandler)
  ctx.canvas.addEventListener('mousemove', mouseEventHandler)

  // for now just take the first touch from the touches list
  function touchEventHandler(e: TouchEvent) {
    const { touches } = e
    const touch = touches[0]

    const { type } = e
    let n

    if (e.type === 'touchend' || e.type === 'touchcancel') {
      for (let i = 0; i < nodes.length; i++) {
        n = nodes[i]
        if (eventTypeToPropName[type] in n.props) {
          n.props[eventTypeToPropName[type]](e)
        }
      }
    }

    if (!touch) return

    const { clientX, clientY } = touch

    const x = clientX - canvasClientRect.x
    const y = clientY - canvasClientRect.y

    for (let i = 0; i < nodes.length; i++) {
      n = nodes[i]
      if (n._path && ctx.isPointInPath(n._path, x, y)) {
        if (eventTypeToPropName[type] in n.props) {
          n.props[eventTypeToPropName[type]](e)
          break
        }
      }
    }
  }

  ctx.canvas.addEventListener('touchstart', touchEventHandler)
  ctx.canvas.addEventListener('touchend', touchEventHandler)
  ctx.canvas.addEventListener('touchcancel', touchEventHandler)
  ctx.canvas.addEventListener('touchmove', touchEventHandler)
}

let currentVNode
let init = false

export function render(canvasCtx, vnode) {
  ctx = canvasCtx

  if (!canvasClientRect) canvasClientRect = ctx.canvas.getBoundingClientRect()
  currentVNode = update(vnode, currentVNode || {})
  draw(ctx, currentVNode)
  if (!init) {
    init = true
    setupListeners()
  }
}
