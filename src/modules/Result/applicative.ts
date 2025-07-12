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

export const { of, ap, apply, flap, flipApply } = Applicative
