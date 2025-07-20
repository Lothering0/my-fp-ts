import * as O from "../Option"
import { createApplicative } from "../../types/Applicative"
import { AsyncOptionHKT, some, toPromise, AsyncOption } from "./async-option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<AsyncOptionHKT> ({
  ...Functor,
  of: some,
  ap: overload (
    1,
    <A, B>(
      self: AsyncOption<(a: A) => B>,
      fma: AsyncOption<A>,
    ): AsyncOption<B> =>
      () =>
        Promise.all ([toPromise (self), toPromise (fma)]).then (([mab, ma]) =>
          pipe (
            O.Do,
            O.apS ("a", ma),
            O.apS ("ab", mab),
            O.map (({ ab, a }) => ab (a)),
          ),
        ),
  ),
})

export const of: {
  <A>(a: A): AsyncOption<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: AsyncOption<A>): (self: AsyncOption<(a: A) => B>) => AsyncOption<B>
  <A, B>(self: AsyncOption<(a: A) => B>, fa: AsyncOption<A>): AsyncOption<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: AsyncOption<A>): (self: AsyncOption<(a: A) => B>) => AsyncOption<B>
  <A, B>(self: AsyncOption<(a: A) => B>, fa: AsyncOption<A>): AsyncOption<B>
} = Applicative.apply

export const flap: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
  <A, B>(self: AsyncOption<A>, fab: AsyncOption<(a: A) => B>): AsyncOption<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
  <A, B>(self: AsyncOption<A>, fab: AsyncOption<(a: A) => B>): AsyncOption<B>
} = Applicative.flipApply
