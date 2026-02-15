import { List, Nil, Cons } from './list'

export const isNil: {
  (list: List<unknown>): list is Nil
} = list => list._tag === 'Nil'

export const isCons: {
  <A>(list: List<A>): list is Cons<A>
} = list => list._tag === 'Cons'
