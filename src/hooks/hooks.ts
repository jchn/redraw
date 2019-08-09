// Largely copied from: https://github.com/preactjs/preact/blob/master/hooks/src/index.js

let currentIndex = 0
let currentComponent

export function renderComponent(c) {
  currentComponent = c
  currentIndex = 0
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

function invokeOrReturn(arg, f) {
  return typeof f === 'function' ? f(arg) : f
}

function getHookState(index) {
  let hooks = currentComponent.__hooks
  if (!hooks) {
    currentComponent.__hooks = { _list: [] }
    hooks = currentComponent.__hooks
  }

  if (index >= hooks._list.length) {
    hooks._list.push({})
  }

  return hooks._list[index]
}
