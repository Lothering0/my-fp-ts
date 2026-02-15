import * as List from './list'
import { create } from '../../typeclasses/Extendable'
import { Functor, NonEmptyFunctor } from './functor'
import { prepend } from './utils'
import { matchLeft } from './matchers'
import { pipe } from '../../utils/flow'

export const Extendable = create<List.Hkt>(Functor, {
  extend: fab =>
    matchLeft({
      onNil: () => List.nil(),
      onCons: (head, tail) =>
        pipe(tail, extend(fab), pipe(tail, prepend(head), fab, prepend)),
    }),
})

export const extend: {
  <F extends List.List<any>, B>(fab: (fa: F) => B): (list: F) => List.With<F, B>
} = Extendable.extend as any

export const NonEmptyExtendable = create<List.NonEmptyHkt>(NonEmptyFunctor, {
  extend,
})

export const duplicate: {
  <F extends List.List<any>>(list: F): List.With<F, List.With<F>>
} = Extendable.duplicate as any
