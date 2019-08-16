export function deg2rad(deg) {
  return (deg * Math.PI) / 180
}

// from https://github.com/preactjs/preact/blob/8c984a276a1c8c52624769da64061d84849a5049/compat/src/index.js#L305
export function shallowDiffers(a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}
