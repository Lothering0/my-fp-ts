import { Applicative, createApplicative } from "../../types/Applicative"
import { functor, map } from "./functor"
import { Either, EitherHKT, right } from "./either"
import { isLeft, fromRight } from "./utils"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<EitherHKT> = createApplicative ({
  ...functor,
  of: right,
  ap: overload (
    1,
    <_, A, B>(self: Either<_, (a: A) => B>, fa: Either<_, A>): Either<_, B> =>
      isLeft (self) ? self : map (fa, fromRight (self)),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative
