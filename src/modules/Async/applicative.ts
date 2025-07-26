import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { AsyncHKT, async, toPromise, Async } from "./async"

export const Applicative = createApplicative<AsyncHKT> ({
  ...Functor,
  of: async,
  ap: fa => self => () =>
    Promise.all ([toPromise (self), toPromise (fa)]).then (([f, a]) => f (a)),
})

export const of: {
  <A>(a: A): Async<A>
} = Applicative.of

export const ap: {
  <A>(fa: Async<A>): <B>(self: Async<(a: A) => B>) => Async<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: Async<(a: A) => B>): (self: Async<A>) => Async<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
