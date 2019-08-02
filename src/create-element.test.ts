import createElement from './create-element'

describe('createElement', () => {
  it('should return a vnode', () => {
    const vnode = createElement('rectangle', { foo: 'bar' })

    expect(vnode.type).toEqual('rectangle')
    expect(vnode.props).toEqual({ foo: 'bar', children: [] })
    expect(vnode).toHaveProperty('_depth', 0)
    expect(vnode).toMatchSnapshot()
  })
})
