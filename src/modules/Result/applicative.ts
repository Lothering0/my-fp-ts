import { create } from '../../typeclasses/Applicative'
import { Functor, map } from './functor'
import { Result, ResultHkt, succeed } from './result'
import { isSuccess } from './refinements'
import { successOf } from './utils'

export const Applicative = create<ResultHkt>(Functor, {
  of: succeed,
  ap: fa => self => (isSuccess(self) ? map(successOf(self))(fa) : self),
})

export const of: {
  <A>(success: A): Result<A>
} = Applicative.of

export const ap: {
  <A, E1>(
    fa: Result<A, E1>,
  ): <B, E2>(self: Result<(a: A) => B, E2>) => Result<B, E1 | E2>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B, E1>(
    fab: Result<(a: A) => B, E1>,
  ): <E2>(self: Result<A, E2>) => Result<B, E1 | E2>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
