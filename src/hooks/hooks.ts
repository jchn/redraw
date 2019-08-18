// Largely copied from: https://github.com/preactjs/preact/blob/master/hooks/src/index.js

let currentIndex = 0
let currentComponent
let afterPaintEffects: any[] = []

export function renderComponent(c) {
  currentComponent = c
  currentIndex = 0

  if (currentComponent.__hooks) {
    currentComponent.__hooks._pendingEffects = handleEffects(
      currentComponent.__hooks._pendingEffects
    )
  }
}

export const unmount = vnode => {
  const c = vnode._component
  if (!c) return

  const hooks = c.__hooks
  if (hooks) {
    hooks._list.forEach(hook => hook._cleanup && hook._cleanup())
  }
}

export function useState(initialState) {
  return useReducer(invokeOrReturn, initialState)
}

export function useReducer(reducer, initialState, init?: any) {
  const hookState = getHookState(currentIndex++)

  if (!hookState._component) {
    hookState._component = currentComponent

    hookState._value = [
      !init ? invokeOrReturn(null, initialState) : init(initialState),
      action => {
        const nextValue = reducer(hookState._value[0], action)
        if (hookState._value[0] !== nextValue) {
          hookState._value[0] = nextValue
          hookState._component.update()
        }
      },
    ]
  }
  return hookState._value
}

function flushAfterPaintEffects() {
  afterPaintEffects.some(component => {
    component._afterPaintQueued = false
    component.__hooks._pendingEffects = handleEffects(
      component.__hooks._pendingEffects
    )
  })
  afterPaintEffects = []
}

const afterPaint = component => {
  if (
    !component._afterPaintQueued &&
    (component._afterPaintQueued = true) &&
    afterPaintEffects.push(component) === 1
  ) {
    window.requestAnimationFrame(flushAfterPaintEffects)
  }
}

export function useEffect(callback, args) {
  const state = getHookState(currentIndex++)
  if (argsChanged(state._args, args)) {
    state._value = callback
    state._args = args

    currentComponent.__hooks._pendingEffects.push(state)
    afterPaint(currentComponent)
  }
}

function invokeEffect(hook) {
  const result = hook._value()
  if (typeof result === 'function') hook._cleanup = result
}

function handleEffects(effects) {
  effects.forEach(invokeCleanup)
  effects.forEach(invokeEffect)
  return []
}

function invokeCleanup(hook) {
  if (hook._cleanup) hook._cleanup()
}

function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index])
}

function invokeOrReturn(arg, f) {
  return typeof f === 'function' ? f(arg) : f
}

function getHookState(index) {
  let hooks = currentComponent.__hooks
  if (!hooks) {
    currentComponent.__hooks = { _list: [], _pendingEffects: [] }
    hooks = currentComponent.__hooks
  }

  if (index >= hooks._list.length) {
    hooks._list.push({})
  }

  return hooks._list[index]
}
