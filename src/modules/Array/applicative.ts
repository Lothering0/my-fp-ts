import { URI } from "./array"
import { Applicative, createApplicative } from "../../types/Applicative"
import {
  ApplicativeWithIndex,
  createApplicativeWithIndex,
} from "../../types/ApplicativeWithIndex"
import { functor, functorWithIndex, map, mapWithIndex } from "./functor"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: a => [a],
  ap: (ff, fa) => map (fa, a => map (ff, f => f (a))).flat (),
})

export const applicativeWithIndex: ApplicativeWithIndex<URI, number> =
  createApplicativeWithIndex ({
    ...functorWithIndex,
    ...applicative,
    apWithIndex: (ff, fa) =>
      mapWithIndex (fa, (i, a) => map (ff, f => f (i, a))).flat (),
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
