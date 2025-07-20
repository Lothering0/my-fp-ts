import { createApplicative } from "../../types/Applicative"
import { OptionHKT, Option, some } from "./option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { match } from "./utils"
import { overload } from "../../utils/overloads"
import { zero } from "./alternative"

export const Applicative = createApplicative<OptionHKT> ({
  ...Functor,
  of: some,
  ap: overload (
    1,
    <_, A, B>(self: Option<(a: A) => B>, fa: Option<A>): Option<B> =>
      match (fa, zero, a =>
        pipe (
          self,
          match (zero, ab => pipe (a, ab, some)),
        ),
      ),
  ),
})

export const of: {
  <A>(a: A): Option<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: Option<A>): (self: Option<(a: A) => B>) => Option<B>
  <A, B>(self: Option<(a: A) => B>, fa: Option<A>): Option<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: Option<A>): (self: Option<(a: A) => B>) => Option<B>
  <A, B>(self: Option<(a: A) => B>, fa: Option<A>): Option<B>
} = Applicative.apply

export const flap: {
  <A, B>(fab: Option<(a: A) => B>): (self: Option<A>) => Option<B>
  <A, B>(self: Option<A>, fab: Option<(a: A) => B>): Option<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: Option<(a: A) => B>): (self: Option<A>) => Option<B>
  <A, B>(self: Option<A>, fab: Option<(a: A) => B>): Option<B>
} = Applicative.flipApply
