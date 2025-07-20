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

export const { of, ap, apply, flap, flipApply } = Applicative
