import { ArrayHKT } from "./array"
import { createApplicative } from "../../types/Applicative"
import { createApplicativeWithIndex } from "../../types/ApplicativeWithIndex"
import { Functor, FunctorWithIndex, map, mapWithIndex } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<ArrayHKT> ({
  ...Functor,
  of: a => [a],
  ap: overload (1, <A, B>(self: Array<(a: A) => B>, fa: A[]) =>
    map (fa, a => map (self, ab => ab (a))).flat (),
  ),
})

export const ApplicativeWithIndex = createApplicativeWithIndex<
  ArrayHKT,
  number
> ({
  ...FunctorWithIndex,
  ...Applicative,
  apWithIndex: overload (
    1,
    <A, B>(self: Array<(i: number, a: A) => B>, fa: A[]) =>
      mapWithIndex (fa, (i, a) => map (self, ab => ab (i, a))).flat (),
  ),
})

export const {
  of,
  ap,
  apply,
  flap,
  flipApply,
  apWithIndex,
  applyWithIndex,
  flapWithIndex,
  flipApplyWithIndex,
} = ApplicativeWithIndex
