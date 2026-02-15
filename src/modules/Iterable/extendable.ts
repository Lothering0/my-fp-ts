import * as Iterable from './iterable'
import { create } from '../../typeclasses/Extendable'
import { Functor, NonEmptyFunctor } from './functor'
import { prepend, zero } from './utils'
import { matchLeft } from './matchers'
import { pipe } from '../../utils/flow'

export const Extendable = create<Iterable.Hkt>(Functor, {
  extend: fab =>
    matchLeft({
      onEmpty: zero<never>,
      onNonEmpty: (head, tail) => {
        const extendedIterable = pipe(tail, prepend(head), fab)
        const extendedTail = pipe(tail, extend(fab))
        return pipe(extendedTail, prepend(extendedIterable))
      },
    }),
})

export const extend: {
  <F extends Iterable<any>, B>(
    fab: (iterable: F) => B,
  ): (iterable: F) => Iterable.With<F, B>
} = Extendable.extend as any

export const NonEmptyExtendable = create<Iterable.NonEmptyHkt>(
  NonEmptyFunctor,
  { extend },
)

export const duplicate: {
  <F extends Iterable<any>>(iterable: F): Iterable.With<F, Iterable.With<F>>
} = Extendable.duplicate as any
