import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { AsyncHKT, async, toPromise, Async } from "./async"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<AsyncHKT> ({
  ...Functor,
  of: async,
  ap: overload (
    1,
    <A, B>(self: Async<(a: A) => B>, fa: Async<A>): Async<B> =>
      () =>
        Promise.all ([toPromise (self), toPromise (fa)]).then (([f, a]) => f (a)),
  ),
})

export const of: {
  <A>(a: A): Async<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: Async<A>): (self: Async<(a: A) => B>) => Async<B>
  <A, B>(self: Async<(a: A) => B>, fa: Async<A>): Async<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: Async<A>): (self: Async<(a: A) => B>) => Async<B>
  <A, B>(self: Async<(a: A) => B>, fa: Async<A>): Async<B>
} = Applicative.apply

export const flap: {
  <A, B>(fab: Async<(a: A) => B>): (self: Async<A>) => Async<B>
  <A, B>(self: Async<A>, fab: Async<(a: A) => B>): Async<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: Async<(a: A) => B>): (self: Async<A>) => Async<B>
  <A, B>(self: Async<A>, fab: Async<(a: A) => B>): Async<B>
} = Applicative.flipApply
