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
  <Success>(success: Success): Result<never, Success>
} = Applicative.of

export const ap: {
  <Failure1, In>(
    fa: Result<Failure1, In>,
  ): <Failure2, Out>(
    self: Result<Failure2, (a: In) => Out>,
  ) => Result<Failure1 | Failure2, Out>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <Failure1, In, Out>(
    fab: Result<Failure1, (a: In) => Out>,
  ): <Failure2>(self: Result<Failure2, In>) => Result<Failure1 | Failure2, Out>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
