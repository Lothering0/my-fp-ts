import * as List from './list'
import { create } from '../../typeclasses/Extendable'
import { Functor } from './functor'
import { prepend } from './utils'
import { matchLeft } from './matchers'
import { pipe } from '../../utils/flow'

export const Extendable = create<List.ListHkt>(Functor, {
  extend: fab =>
    matchLeft({
      onNil: () => List.nil(),
      onCons: (head, tail) =>
        pipe(tail, extend(fab), pipe(tail, prepend(head), fab, prepend)),
    }),
})

export const extend: {
  <A, B>(fab: (fa: List.List<A>) => B): (list: List.List<A>) => List.List<B>
} = Extendable.extend

export const duplicate: {
  <A>(list: List.List<A>): List.List<List.List<A>>
} = Extendable.duplicate
