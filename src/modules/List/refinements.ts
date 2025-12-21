import { List, Nil, Cons } from './list'

export const isNil: {
  (xs: List<unknown>): xs is Nil
} = xs => xs._tag === 'Nil'

export const isCons: {
  <A>(xs: List<A>): xs is Cons<A>
} = xs => xs._tag === 'Cons'
