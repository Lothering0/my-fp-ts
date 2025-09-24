import { createApplicative } from "../../typeclasses/Applicative"
import { Functor, map } from "./functor"
import { Result, ResultHkt, succeed } from "./result"
import { isSuccess } from "./refinements"
import { successOf } from "./utils"

export const Applicative = createApplicative<ResultHkt> ({
  ...Functor,
  of: succeed,
  ap: fa => self => isSuccess (self) ? map (successOf (self)) (fa) : self,
})

export const of: {
  <A>(a: A): Result<never, A>
} = Applicative.of

export const ap: {
  <E1, A>(
    fa: Result<E1, A>,
  ): <E2, B>(self: Result<E2, (a: A) => B>) => Result<E1 | E2, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <E1, A, B>(
    fab: Result<E1, (a: A) => B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
