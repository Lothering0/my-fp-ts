import { overload } from "../utils/overloads"
import { LazyArg } from "../types/utils"

export const not: {
  <B extends boolean>(b: B): B extends true ? false : true
} = <B>(b: B) => !b as B extends true ? false : true

export const match: {
  <A>(whenFalse: LazyArg<A>, whenTrue: LazyArg<A>): (self: boolean) => A
  <A>(self: boolean, whenFalse: LazyArg<A>, whenTrue: LazyArg<A>): A
} = overload (2, (x, whenFalse, whenTrue) => x ? whenTrue () : whenFalse ())
