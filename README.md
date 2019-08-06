# Redraw

Canvas + JSX + Hooks

<p align="center">
  <img width="543" height="463" alt="redraw demo" src="/media/redraw-example.gif" />
</p>

[View on CodePen](https://codepen.io/JohnvandeWater/pen/5de1299cbacff72b850183f220636487)

**⚠️ Please note that this still is a work in progress ️️️⚠️**

## Getting started

Install Redraw:

```
npm i @jchn/redraw
```

### Configure Babel

You can use JSX to create your views, to do this you need to configure babel to use Redraw's `createElement` function.

#### Drawing a rectangle on the canvas

```jsx
import { render, createElement as h } from '@jchn/redraw'

/* @jsx h */

const view = (
  <rectangle x={10} y={10} width={50} height={50} />
)

// obtain the CanvasRenderContext2D object
const ctx = document.querySelector('canvas').getContext('2d')

// mount the application by passing the view and the context to Redraw's render function
render(ctx, view)
```

## Components

You can create your own components by creating functions:

```jsx
const MyRectangle = ({ x, y, width, height, children }) => {
  return (
    <rectangle x={x} y={y} width={width} height={height}>
      {children}
    </rectangle>
  )
}
```

## Events

You can add events to elements by using props like `onClick`:

```jsx
const view = (
  <rectangle x={10} y={10} width={50} height={50} onClick={e => {
    console.log('click!')
  }} />
)
```

**Note: not alle events are yet supported**

## Hooks

Currently you can only use the `useState` hook, more hooks to come!

```jsx
import { useState } from '@jchn/redraw'

const MyRectangle = ({ x, y, width, height, children }) => {

  const [count, setCount] = useState(0)

  return (
    <rectangle x={x} y={y} width={width} height={height} onClick={() => {
      setCounter(count + 1)
    }}>
      clicked {count} times!
    </rectangle>
  )
}
```

<!-- ## Demo's -->
