import { overload } from "../utils/overloads"
import { LazyArg } from "../types/utils"
import { Show } from "../types/Show"

export const not: {
  <B extends boolean>(b: B): B extends true ? false : true
} = <B>(b: B) => !b as B extends true ? false : true

export const match: {
  <A>(onFalse: LazyArg<A>, onTrue: LazyArg<A>): (self: boolean) => A
  <A>(self: boolean, onFalse: LazyArg<A>, onTrue: LazyArg<A>): A
} = overload (2, (x, onFalse, onTrue) => x ? onTrue () : onFalse ())

export const show: {
  <B extends boolean>(self: B): `${B}`
} = self => `${self}`

const Show: Show<boolean> = { show }

export { Show }
