const eventNames = {
  onClick: 'click',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onMouseMove: 'mousemove',
  onDoubleClick: 'doubleClick'
}

export function onEventToEventName (onEventName) {
  const eventName = eventNames[onEventName]

  if (eventName) return eventName 

  console.warn('no event name found for', onEventName)
}

export function overlap (point, rectangle) {
  return (point.x > rectangle.x && point.x < (rectangle.x + rectangle.width) &&
    point.y > rectangle.y && point.y < (rectangle.y + rectangle.height))
}
