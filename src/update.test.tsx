import createElement from './create-element'
import update from './update'
import { vec2, mat2d } from './matrix'
import { deg2rad } from './utils'

describe('update element', () => {
  const vnode = <rectangle x={0} y={0} width={10} height={10} />
  update(vnode, {})

  it('should add _dimensions to vnode', () => {
    expect(vnode).toHaveProperty('_dimensions', { width: 10, height: 10 })
  })

  it('should add _matrix to vnode', () => {
    expect(vnode).toHaveProperty('_matrix', mat2d.fromValues(1, 0, 0, 1, 0, 0))
  })
})

describe('update children', () => {
  const vnode = (
    <rectangle x={10} y={10} width={500} height={500}>
      <rectangle x={20} y={10} width={50} height={50} />
    </rectangle>
  )
  update(vnode, {})

  it('should add _children property with child node', () => {
    expect(vnode._children).toHaveLength(1)
  })

  it('should add _matrix property to child node', () => {
    expect(vnode).toHaveProperty(
      ['_children', 0, '_matrix'],
      mat2d.fromValues(1, 0, 0, 1, 30, 20)
    )
  })
})

const Rectangle = props => <rectangle {...props} />

describe('update function component', () => {
  const vnode = <Rectangle x={10} y={10} width={10} height={10} />

  update(vnode, {})

  it('should add _component to vnode', () => {
    expect(vnode._component.constructor).toBe(Rectangle)
  })
})

const RectangleWithNestedElements = props => (
  <rectangle {...props}>
    <rectangle x={10} y={10} width={50} height={50} />
  </rectangle>
)

describe('update function component with nested elements', () => {
  const vnode = (
    <RectangleWithNestedElements x={100} y={100} width={500} height={500} />
  )
  update(vnode, {})

  it('should add _children to vnode', () => {
    expect(vnode._children).toHaveLength(1)
  })

  it('should add _matrix property to nested element', () => {
    expect(vnode._children[0]._matrix).toStrictEqual(
      mat2d.fromValues(1, 0, 0, 1, 100, 100)
    )
  })

  it('should offset the _matrix of the child element', () => {
    expect(vnode._children[0]._children[0]._matrix).toStrictEqual(
      mat2d.fromValues(1, 0, 0, 1, 110, 110)
    )
  })
})

const RectangleWithChildrenProp = props => (
  <rectangle x={props.x} y={props.y} width={props.width} height={props.height}>
    {props.children}
  </rectangle>
)

describe('function component with children prop', () => {
  const vnode = (
    <RectangleWithChildrenProp x={100} y={100} width={500} height={500}>
      <rectangle x={10} y={10} width={50} height={50} />
    </RectangleWithChildrenProp>
  )

  update(vnode, {})

  it('should add _children to vnode', () => {
    expect(vnode._children).toHaveLength(1)
  })

  it('should add _matrix property to nested element', () => {
    expect(vnode._children[0]._matrix).toStrictEqual(
      mat2d.fromValues(1, 0, 0, 1, 100, 100)
    )
  })

  it('should offset the _matrix of the child element', () => {
    expect(vnode._children[0]._children[0]._matrix).toStrictEqual(
      mat2d.fromValues(1, 0, 0, 1, 110, 110)
    )
  })
})

describe('updating node with existing component', () => {
  const oldVNode = <Rectangle x={10} y={10} width={10} height={10} />

  const newVNode = <Rectangle x={15} y={10} width={10} height={10} />

  it('should retain the same component instance if consecutive updates are of the function type', () => {
    const c1 = update(oldVNode, {})._component
    const c2 = update(newVNode, oldVNode)._component

    expect(c1).toBe(c2)
  })
})

const RectangleWithRenderProp = props => (
  <rectangle x={props.x} y={props.x} width={props.width} height={props.height}>
    {props.render({ foo: 'bar' })}
  </rectangle>
)

describe('render props', () => {
  const render = ({ foo }) => (
    <circle x={0} y={0} width={5} height={5} foo={foo} />
  )

  const vnode = (
    <RectangleWithRenderProp
      x={10}
      y={10}
      width={10}
      height={10}
      render={render}
    />
  )

  update(vnode, {})

  it('should render via props', () => {
    expect(vnode._children[0]._children[0]).toHaveProperty('type', 'circle')
    expect(vnode._children[0]._children[0]._matrix).toEqual(
      mat2d.fromValues(1, 0, 0, 1, 10, 10)
    )
    expect(vnode._children[0]._children[0].props).toHaveProperty('foo', 'bar')
  })
})

describe('component instances', () => {
  const vnode = <Rectangle x={10} y={10} width={10} height={10} />
  it('should have a update method', () => {
    update(vnode, {})

    expect(vnode._component).toHaveProperty('update')
  })
})

describe('update rotation', () => {
  const vnode = <rectangle x={10} y={10} width={10} height={10} rotate={90} />
  it('should rotate _matrix of the vnode', () => {
    update(vnode, {})

    const expMatrix = mat2d.create()

    mat2d.translate(expMatrix, expMatrix, vec2.fromValues(10, 10))
    mat2d.rotate(expMatrix, expMatrix, deg2rad(90))

    expect(vnode._matrix).toEqual(expMatrix)
  })

  it('should rotate the _matrix of a child of a vnode', () => {
    const vnode = (
      <rectangle x={10} y={10} width={100} height={100} rotate={90}>
        <rectangle x={10} y={10} width={10} height={10} />
      </rectangle>
    )

    update(vnode, {})

    const expMatrix = mat2d.create()
    mat2d.translate(expMatrix, expMatrix, vec2.fromValues(10, 10))
    mat2d.rotate(expMatrix, expMatrix, deg2rad(90))
    mat2d.translate(expMatrix, expMatrix, vec2.fromValues(10, 10))

    expect(vnode._children[0]._matrix).toEqual(expMatrix)
  })
})
