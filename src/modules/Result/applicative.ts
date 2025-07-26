import { createApplicative } from "../../types/Applicative"
import { Functor, map } from "./functor"
import { Result, ResultHKT, success } from "./result"
import { isSuccess } from "./refinements"
import { fromSuccess } from "./utils"

export const Applicative = createApplicative<ResultHKT> ({
  ...Functor,
  of: success,
  ap: fa => self => isSuccess (self) ? map (fromSuccess (self)) (fa) : self,
})

export const of: {
  <_, A>(a: A): Result<_, A>
} = Applicative.of

export const ap: {
  <_, A>(fa: Result<_, A>): <B>(self: Result<_, (a: A) => B>) => Result<_, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <_, A, B>(fab: Result<_, (a: A) => B>): (self: Result<_, A>) => Result<_, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
