import { createApplicative } from "../../types/Applicative"
import { Functor, map } from "./functor"
import { Result, ResultHKT, success } from "./result"
import { isSuccess } from "./refinements"
import { fromSuccess } from "./utils"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<ResultHKT> ({
  ...Functor,
  of: success,
  ap: overload (
    1,
    <_, A, B>(self: Result<_, (a: A) => B>, fa: Result<_, A>): Result<_, B> =>
      isSuccess (self) ? map (fa, fromSuccess (self)) : self,
  ),
})

export const of: {
  <_, A>(a: A): Result<_, A>
} = Applicative.of

export const ap: {
  <_, A, B>(fa: Result<_, A>): (self: Result<_, (a: A) => B>) => Result<_, B>
  <_, A, B>(self: Result<_, (a: A) => B>, fa: Result<_, A>): Result<_, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <_, A, B>(fa: Result<_, A>): (self: Result<_, (a: A) => B>) => Result<_, B>
  <_, A, B>(self: Result<_, (a: A) => B>, fa: Result<_, A>): Result<_, B>
} = Applicative.apply

export const flap: {
  <_, A, B>(fab: Result<_, (a: A) => B>): (self: Result<_, A>) => Result<_, B>
  <_, A, B>(self: Result<_, A>, fab: Result<_, (a: A) => B>): Result<_, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <_, A, B>(fab: Result<_, (a: A) => B>): (self: Result<_, A>) => Result<_, B>
  <_, A, B>(self: Result<_, A>, fab: Result<_, (a: A) => B>): Result<_, B>
} = Applicative.flipApply
