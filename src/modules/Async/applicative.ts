import { Applicative, createApplicative } from "../../types/Applicative"
import { functor } from "./functor"
import { AsyncHKT, async, fromAsync, Async } from "./async"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<AsyncHKT> = createApplicative ({
  ...functor,
  of: async,
  ap: overload (
    1,
    <A, B>(self: Async<(a: A) => B>, fa: Async<A>): Async<B> =>
      () =>
        Promise.all ([fromAsync (self), fromAsync (fa)]).then (([f, a]) => f (a)),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative
