import { flow, pipe } from "../../utils/flow"
import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { State, StateHKT } from "./state"

export const Applicative = createApplicative<StateHKT> ({
  ...Functor,
  of:
    <S, A>(a: A) =>
    (s: S) => [a, s],
  ap: fab => self =>
    flow (fab, ([a1, s1]) => pipe (s1, self, ([a2, s2]) => [a2 (a1), s2])),
})

export const of: {
  <S, A>(a: A): State<S, A>
} = Applicative.of

export const ap: {
  <S, A>(fa: State<S, A>): <B>(self: State<S, (a: A) => B>) => State<S, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <S, A, B>(fab: State<S, (a: A) => B>): (self: State<S, A>) => State<S, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
