import { LazyArg } from '../types/utils'

export const call0: {
  <A>(f: LazyArg<A>): A
} = f => f()

export const call: {
  <A, B>(ab: (a: A) => B): (a: A) => B
} = ab => a => ab(a)

export const callWith: {
  <A>(a: A): <B>(ab: (a: A) => B) => B
} = a => ab => call(ab)(a)
