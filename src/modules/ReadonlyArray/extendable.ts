import * as Array from './readonly-array'
import { create } from '../../typeclasses/Extendable'
import { Functor, NonEmptyFunctor } from './functor'
import { prepend } from './utils'
import { matchLeft } from './matchers'
import { constEmptyArray } from '../../utils/constant'
import { pipe } from '../../utils/flow'

export const Extendable = create<Array.Hkt>(Functor, {
  extend: fab =>
    matchLeft({
      onEmpty: constEmptyArray,
      onNonEmpty: (head, tail) => {
        const extendedArray = pipe(tail, prepend(head), fab)
        const extendedTail = pipe(tail, extend(fab))
        return pipe(extendedTail, prepend(extendedArray))
      },
    }),
})

export const extend: {
  <F extends ReadonlyArray<any>, B>(
    fab: (fa: F) => B,
  ): (array: F) => Array.With<F, B>
} = Extendable.extend as any

export const NonEmptyExtendable = create<Array.NonEmptyHkt>(NonEmptyFunctor, {
  extend,
})

export const duplicate: {
  <F extends ReadonlyArray<any>>(array: F): Array.With<F, Array.With<F>>
} = Extendable.duplicate as any
