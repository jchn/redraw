const eventNames = {
  onClick: 'click',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onMouseMove: 'mousemove',
  onDoubleClick: 'doubleClick',
  onWheel: 'wheel',
  onTouchStart: 'touchstart',
  onTouchEnd: 'touchend',
  onTouchMove: 'touchmove'
}

const onEventNames = (() => {
  let names = {}
  for (let key in eventNames) {
    names[eventNames[key]] = key
  }
  return names
})()

export function onEventToEventName (onEventName) {
  const eventName = eventNames[onEventName]

  if (eventName) return eventName 

  console.warn('no event name found for', onEventName)
}

export function eventNameToOnEventName (eventName) {
  const onEventName = onEventNames[eventName]

  if (onEventName) return onEventName

  console.warn('no on event name found for', eventName)
}

export function overlap (point, rectangle) {
  return (point.x > rectangle.x && point.x < (rectangle.x + rectangle.width) &&
    point.y > rectangle.y && point.y < (rectangle.y + rectangle.height))
}
