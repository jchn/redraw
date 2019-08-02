function createElement (type, props, ...children) {
  return createVNode({
    type,
    props: Object.assign(props, { children })
  })
}

function createVNode ({ type, props }) {
  return {
    type,
    props,
    _children: null,
    _position: null,
    _dimensions: null,
    _component: null,
    _parent: null,
    _depth: 0
  }
}

export default createElement
