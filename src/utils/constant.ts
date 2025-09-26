import { LazyArg } from '../types/utils'
import { _ } from './underscore'

export const constant: {
  <Out>(a: Out): LazyArg<Out>
} = a => () => a

export const constFalse: LazyArg<false> = constant(false)

export const constTrue: LazyArg<true> = constant(true)

export const constNull: LazyArg<null> = constant(null)

export const constUndefined: LazyArg<undefined> = constant(undefined)

export const constVoid: LazyArg<void> = constant(_)

export const constEmptyArray: LazyArg<readonly []> = constant([])
