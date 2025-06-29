import { ArrayHKT } from "./array"
import { Applicative, createApplicative } from "../../types/Applicative"
import {
  ApplicativeWithIndex,
  createApplicativeWithIndex,
} from "../../types/ApplicativeWithIndex"
import { functor, functorWithIndex, map, mapWithIndex } from "./functor"
import { overload } from "src/utils/overloads"

export const applicative: Applicative<ArrayHKT> = createApplicative ({
  ...functor,
  of: a => [a],
  ap: overload (1, <A, B>(self: Array<(a: A) => B>, fa: A[]) =>
    map (fa, a => map (self, ab => ab (a))).flat (),
  ),
})

export const applicativeWithIndex: ApplicativeWithIndex<ArrayHKT, number> =
  createApplicativeWithIndex ({
    ...functorWithIndex,
    ...applicative,
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
} = applicativeWithIndex
