import { _URI } from "./array"
import { Applicative, createApplicative } from "../../types/Applicative"
import {
  ApplicativeWithIndex,
  createApplicativeWithIndex,
} from "../../types/ApplicativeWithIndex"
import { functor, functorWithIndex, map, mapWithIndex } from "./functor"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  ...functor,
  of: a => [a],
  apply: (fa, ff) => map (fa, a => map (ff, f => f (a))).flat (),
})

export const applicativeWithIndex: ApplicativeWithIndex<typeof _URI, number> =
  createApplicativeWithIndex ({
    ...functorWithIndex,
    ...applicative,
    applyWithIndex: (fa, ff) =>
      mapWithIndex (fa, (i, a) => map (ff, f => f (i, a))).flat (),
  })

export const { of, apply, ap, applyWithIndex, apWithIndex } =
  applicativeWithIndex
