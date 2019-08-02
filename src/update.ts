import { onEventToEventName, overlap } from "./utils";
import { renderComponent } from './hooks'
import draw from './draw'

let nodes: any[] = []
let listeners = {}
let ctx: CanvasRenderingContext2D

function Component (props) {
  // @ts-ignore
  this.props = props
}

Component.prototype.update = function (all) {
  if (all) {
    console.log('update entrire canvas for', this)
  } else {
    console.log('update', this)
  }
}

function doRender (props) {
  // @ts-ignore
  return this.constructor(props)
}

function update (newVNode, oldVNode) {
  const newType = newVNode.type
  const newProps = newVNode.props
  const newParent = newVNode._parent
  let tmp

  newVNode._dimensions = { width: newProps.width, height: newProps.height }

  if (newParent) {
    if (typeof newParent.type === 'function') {
      newVNode._position = Object.assign({}, newParent._position)
    } else {
      newVNode._position = { x: newProps.x + newParent._position.x, y: newProps.y + newParent._position.y }
    }
  } else {
    newVNode._position = { x: newProps.x, y: newProps.y }
  }

  if (typeof newType === 'function') {
    let c

    if (oldVNode._component) {
      c = newVNode._component = oldVNode._component
    } else {
      newVNode._component  = c = new Component(newProps)
      c.constructor = newType
      c.render = doRender
    }

    renderComponent(c)
    tmp = c.render(newProps)

    newVNode._children = toChildArray(tmp) // probably have to do some sanitizing on this value

  } else {
    nodes.push(newVNode)
    updateEvents(newVNode.props)
    newVNode._children = toChildArray(newVNode.props.children)
  }
  updateChildren(newVNode, oldVNode)

  return newVNode
}

function updateChildren (newParentVNode, oldParentVNode) {
  let newChild, oldChild
  let newChildren = newParentVNode._children
  let oldChildren = oldParentVNode ? oldParentVNode._children : null

  if (!newChildren) return

  for (let i = 0; i < newChildren.length; i++) {
    if (newChild === null) continue

    newChild = newChildren[i]
    newChild._parent = newParentVNode
    newChild._depth = newParentVNode._depth + 1

    update(newChild, oldChild)
  }
}

// Events

function updateEvents (props) {
  let eventName
  if (!props) return
  Object.keys(props).filter(key => key[0] + key[1] === 'on').forEach(eventKey => {
    eventName = onEventToEventName(eventKey)

    if (eventName in ctx.canvas && !(eventName in listeners)) {
      createListenerForEvent(eventName)
    }
  })
}

function createListenerForEvent(eventName) { 
  const listener = e => {
    const { offsetX, offsetY } = e
    fireEvent(eventName, { x: offsetX, y: offsetY }, e)
  }
  listeners[eventName] = listener
  ctx.canvas.addEventListener(eventName, listener)
}

function fireEvent (eventName, { x, y }, originalEvent) {
  let n
  for (let i = 0; i < nodes.length; i++) {
    n = nodes[i]
    if (n._dimensions && n._position && overlap({x, y}, { ...n._position, ...n._dimensions })) {
      if (eventName in n.props) {
        n.props[eventName](originalEvent)
        break
      }
    }
  }
}

function toChildArray (vnode: {}|[]) {
  if (!vnode) return []

  if (!Array.isArray(vnode)) {
    return [vnode]
  } else {
    return vnode.flatMap(c => c)
  }
}

export default update

let currentVNode

export function render (canvasCtx, vnode) {
  ctx = canvasCtx
  nodes = []
  currentVNode = update(vnode, currentVNode || {})
  draw(ctx, currentVNode)
}
