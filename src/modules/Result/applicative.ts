import { Applicative, createApplicative } from "../../types/Applicative"
import { functor, map } from "./functor"
import { Result, ResultHKT, success } from "./result"
import { isFailure, fromSuccess } from "./utils"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<ResultHKT> = createApplicative ({
  ...functor,
  of: success,
  ap: overload (
    1,
    <_, A, B>(self: Result<_, (a: A) => B>, fa: Result<_, A>): Result<_, B> =>
      isFailure (self) ? self : map (fa, fromSuccess (self)),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative
