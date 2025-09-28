import * as Applicative_ from '../../typeclasses/Applicative'
import { constant } from '../../utils/constant'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'
import { Reader, ReaderHkt } from './reader'

export const Applicative = Applicative_.create<ReaderHkt>(Functor, {
  of: constant,
  ap: fa => self => r => pipe(r, fa, self(r)),
})

export const of: {
  <R, A>(a: A): Reader<R, A>
} = Applicative.of

export const ap: {
  <R, A>(fa: Reader<R, A>): <B>(self: Reader<R, (a: A) => B>) => Reader<R, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <R, A, B>(fab: Reader<R, (a: A) => B>): (self: Reader<R, A>) => Reader<R, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
