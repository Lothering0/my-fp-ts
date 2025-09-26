import * as applicative from '../../typeclasses/Applicative'
import { constant } from '../../utils/constant'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'
import { Reader, ReaderHkt } from './reader'

export const Applicative = applicative.create<ReaderHkt>(Functor, {
  of: constant,
  ap: fa => self => r => pipe(r, fa, self(r)),
})

export const of: {
  <Fixed, In>(a: In): Reader<Fixed, In>
} = Applicative.of

export const ap: {
  <Fixed, In>(
    fa: Reader<Fixed, In>,
  ): <Out>(self: Reader<Fixed, (a: In) => Out>) => Reader<Fixed, Out>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <Fixed, In, Out>(
    fab: Reader<Fixed, (a: In) => Out>,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, Out>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
