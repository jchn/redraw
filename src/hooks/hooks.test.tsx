import createElement from '../create-element'
import update from '../update'
import { useState } from './hooks'

describe('useState', () => {
  const StatefulRectangle = props => {
    const [x] = useState(10)
    return (
      <rectangle x={x} y={props.y} width={props.width} height={props.height} />
    )
  }

  const vnode = <StatefulRectangle y={10} width={10} height={10} />

  update(vnode, {})

  it('should add __hooks to the component instance', () => {
    expect(vnode._component).toHaveProperty('__hooks')
  })

  it('should contain the correct state value', () => {
    expect(vnode._component.__hooks._list[0]._value[0]).toEqual(10)
  })

  it('should pass the value to the x prop of the rectangle', () => {
    expect(vnode._children[0].props).toHaveProperty('x', 10)
  })
})

describe('calling setState', () => {

  let call

  const StatefulRectangle = props => {
    const [x, setX] = useState(10)
  
    call = setX
  
    return (
      <rectangle x={x} y={props.y} width={props.width} height={props.height} />
    )
  }

  const vnode = <StatefulRectangle y={10} width={10} height={10} />

  update(vnode, {})
  call(20)
  update(vnode, vnode)

  it('should contain the updated state value', () => {
    expect(vnode._component.__hooks._list[0]._value[0]).toEqual(20)
  })

  it('should pass the value to the x prop of the rectangle', () => {
    expect(vnode._children[0].props).toHaveProperty('x', 20)
  })
})
