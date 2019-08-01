import { onEventToEventName, overlap } from "./utils";

let nodes: any[] = []
let listeners = {}
let ctx: CanvasRenderingContext2D

function Component (props) {
  // @ts-ignore
  this.props = props
}

Component.prototype.redraw = function (all) {
  if (all) {
    console.log('redraw entrire canvas for', this)
  } else {
    console.log('redraw', this)
  }
}

function doRender (props) {
  // @ts-ignore
  this.constructor(props)
}

function update (newVNode, oldVNode) {
  const newType = newVNode.type
  const newProps = newVNode.props
  let tmp

  newVNode._position = { x: newProps.x, y: newProps.y }
  newVNode._dimensions = { width: newProps.width, height: newProps.height }

  if (newType === 'function') {
    let c

    if (oldVNode._component) {
      c = newVNode._component = oldVNode._component
    } else {
      newVNode._component  = c = new Component(newProps)
      c.constructor = newType
      c.render = doRender
    }

    tmp = c.render(newProps)

    newVNode._children = tmp // probably have to do some sanitizing on this value
    
  } else {
    nodes.push(newVNode)
    updateEvents(newVNode.props)
  }
  updateChildren(newVNode, oldVNode)
}

function updateChildren (newParentVNode, oldParentVNode) {
  let newChild, oldChild
  let newChildren = newParentVNode._children
  let oldChildren = oldParentVNode._children

  if (!newChildren) return

  for (let i; i < newChildren.length; i++) {
    if (newChild === null) continue

    newChild = newChildren[i]
    newChild._parent = newParentVNode
    newChild._depth = newParentVNode._depth + 1

    oldChild = oldChildren[i]

    if (!oldChild) continue

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
