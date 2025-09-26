import { create } from "../../typeclasses/Applicative"
import { Functor } from "./functor"
import { AsyncHkt, async, toPromise, Async } from "./async"

export const Applicative = create<AsyncHkt> (Functor, {
  of: async,
  ap: fa => self => () =>
    Promise.all ([toPromise (self), toPromise (fa)]).then (([f, a]) => f (a)),
})

export const of: {
  <Out>(a: Out): Async<Out>
} = Applicative.of

export const ap: {
  <In>(fa: Async<In>): <Out>(self: Async<(a: In) => Out>) => Async<Out>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <In, Out>(fab: Async<(a: In) => Out>): (self: Async<In>) => Async<Out>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
