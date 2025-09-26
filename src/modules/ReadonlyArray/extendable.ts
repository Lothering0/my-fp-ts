import { create } from '../../typeclasses/Extendable'
import { ReadonlyArrayHkt } from './readonly-array'
import { Functor } from './functor'
import { fromNonEmpty, prepend } from './utils'
import { matchLeft } from './matchers'
import { constEmptyArray } from '../../utils/constant'
import { pipe } from '../../utils/flow'

export const Extendable = create<ReadonlyArrayHkt>(Functor, {
  extend: fab =>
    matchLeft({
      onEmpty: constEmptyArray,
      onNonEmpty: (head, tail) =>
        pipe(
          tail,
          extend(fab),
          pipe(prepend(head)(tail), fab, prepend),
          fromNonEmpty,
        ),
    }),
})

export const extend: {
  <A, B>(
    fab: (fa: ReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<ReadonlyArray<A>>
} = Extendable.duplicate
