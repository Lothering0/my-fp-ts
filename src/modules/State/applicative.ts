import { flow, pipe } from "../../utils/flow"
import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { State, StateHKT } from "./state"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<StateHKT> ({
  ...Functor,
  of:
    <S, A>(a: A) =>
    (s: S) => [a, s],
  ap: overload (
    1,
    <S, A, B>(self: State<S, A>, fab: State<S, (a: A) => B>): State<S, B> =>
      flow (self, ([a1, s1]) => pipe (s1, fab, ([a2, s2]) => [a2 (a1), s2])),
  ),
})

export const of: {
  <S, A>(a: A): State<S, A>
} = Applicative.of

export const ap: {
  <S, A, B>(fa: State<S, A>): (self: State<S, (a: A) => B>) => State<S, B>
  <S, A, B>(self: State<S, (a: A) => B>, fa: State<S, A>): State<S, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <S, A, B>(fa: State<S, A>): (self: State<S, (a: A) => B>) => State<S, B>
  <S, A, B>(self: State<S, (a: A) => B>, fa: State<S, A>): State<S, B>
} = Applicative.apply

export const flap: {
  <S, A, B>(fab: State<S, (a: A) => B>): (self: State<S, A>) => State<S, B>
  <S, A, B>(self: State<S, A>, fab: State<S, (a: A) => B>): State<S, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <S, A, B>(fab: State<S, (a: A) => B>): (self: State<S, A>) => State<S, B>
  <S, A, B>(self: State<S, A>, fab: State<S, (a: A) => B>): State<S, B>
} = Applicative.flipApply
