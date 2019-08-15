import {
  create as mat2dCreate,
  copy as mat2dCopy,
  translate as mat2dTranslate,
  rotate as mat2dRotate,
  fromValues as mat2dFromValues,
} from 'gl-matrix/mat2d'
import {
  create as vec2Create,
  fromValues as vec2FromValues,
  transformMat2d as vec2TransformMat2d,
} from 'gl-matrix/vec2'

export const mat2d = {
  create: mat2dCreate,
  copy: mat2dCopy,
  translate: mat2dTranslate,
  rotate: mat2dRotate,
  fromValues: mat2dFromValues,
}

export const vec2 = {
  create: vec2Create,
  fromValues: vec2FromValues,
  transformMat2d: vec2TransformMat2d,
}
