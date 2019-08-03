import { onEventToEventName, eventNameToOnEventName, overlap } from "./utils";
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

  window.requestAnimationFrame(() => render(ctx, currentVNode))
  // if (all) {
  //   console.log('update entrire canvas for', this)
  // } else {
  //   console.log('update', this)
  // }
}

function doRender (props) {
  // @ts-ignore
  return this.constructor(props)
}

function getLastKnownPosition (vnode) {
  if (vnode._parent && vnode._parent._position) {
    return vnode._parent._position
  } else if (vnode._parent) {
    return getLastKnownPosition(vnode._parent)
  } else {
    return { x: 0, y: 0 }
  }
}

function update (newVNode, oldVNode) {
  const newType = newVNode.type
  const newProps = newVNode.props
  let tmp

  if (typeof newType === 'function') {
    let c

    if (oldVNode && oldVNode._component) {
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
    const offset = getLastKnownPosition(newVNode)
    newVNode._position = { x: newProps.x + offset.x, y: newProps.y + offset.y }
    newVNode._dimensions = { width: newProps.width, height: newProps.height }

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
  let oldChildren = oldParentVNode && oldParentVNode._children ? oldParentVNode._children : []

  if (!newChildren) return

  if (newParentVNode.type === 'text' && Array.isArray(newChildren)) {
    newChildren = newParentVNode._children = [newChildren.join(' ')]
  }

  for (let i = 0; i < newChildren.length; i++) {
    newChild = newChildren[i]

    if (newChild === null || typeof newChild === 'string') continue

    newChild._parent = newParentVNode
    newChild._depth = newParentVNode._depth + 1

    oldChild = oldChildren[i]

    update(newChild, oldChild)
  }
}

// Events

function updateEvents (props) {
  let eventName
  if (!props) return
  Object.keys(props).filter(key => key[0] + key[1] === 'on').forEach(eventKey => {
    eventName = onEventToEventName(eventKey)
    if (eventKey.toLowerCase() in ctx.canvas && !(eventName in listeners)) {
      createListenerForEvent(eventName)
    }
  })
}

let canvasClientRect

function getPositionFromEvent (event) {
  if (event instanceof MouseEvent) {
    return { x: event.offsetX, y: event.offsetY }
  }

  if (event instanceof TouchEvent) {
    var x = event.changedTouches[0].pageX - canvasClientRect.left;
    var y = event.changedTouches[0].pageY - canvasClientRect.top;

    return { x, y }
  }

  console.warn('event', event, 'not yet supported')

  return { x: undefined, y: undefined }
}

function createListenerForEvent(eventName) { 
  const listener = e => {
    const position = getPositionFromEvent(e)

    fireEvent(eventName, position, e)
  }
  listeners[eventName] = listener
  ctx.canvas.addEventListener(eventName, listener)
}

function fireEvent (eventName, { x, y }, originalEvent) {
  let n
  const onEventName = eventNameToOnEventName(eventName)
  for (let i = 0; i < nodes.length; i++) {
    n = nodes[i]
    if (n._dimensions && n._position && overlap({x, y}, { ...n._position, ...n._dimensions })) {
      if (onEventName in n.props) {
        n.props[onEventName](originalEvent)
        break
      }
    }
  }
}

const flatten = arr => {
  if (!Array.isArray(arr)) return arr

  let curr, output:any[] = []
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

function toChildArray (vnode: {}|[]) {
  if (!vnode) return []

  if (!Array.isArray(vnode)) {
    return [vnode]
  } else {
    return flatten(vnode)
  }
}

export default update

let currentVNode

export function render (canvasCtx, vnode) {
  ctx = canvasCtx
  if (!canvasClientRect) canvasClientRect = ctx.canvas.getBoundingClientRect()
  nodes = []
  currentVNode = update(vnode, currentVNode || {})
  draw(ctx, currentVNode)
  nodes.reverse()
}
