import { flow, pipe } from "../../utils/flow"
import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { functor } from "./functor"
import { URI } from "./state"

export const applicative: Applicative2<URI> = createApplicative2 ({
  ...functor,
  of:
    <S, A>(a: A) =>
    (s: S) => [a, s],
  ap: (ff, fa) =>
    flow (fa, ([a1, s1]) => pipe (s1, ff, ([a2, s2]) => [a2 (a1), s2])),
})

export const { of, ap, apply, flap, flipApply } = applicative
