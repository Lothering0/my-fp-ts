import * as option from "../Option"
import { createApplicative } from "../../types/Applicative"
import { AsyncOptionHkt, some, toPromise, AsyncOption } from "./async-option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"

export const Applicative = createApplicative<AsyncOptionHkt> ({
  ...Functor,
  of: some,
  ap: fma => self => () =>
    Promise.all ([toPromise (self), toPromise (fma)]).then (([mab, ma]) =>
      pipe (
        option.Do,
        option.apS ("a", ma),
        option.apS ("ab", mab),
        option.map (({ ab, a }) => ab (a)),
      ),
    ),
})

export const of: {
  <A>(a: A): AsyncOption<A>
} = Applicative.of

export const ap: {
  <A>(fa: AsyncOption<A>): <B>(self: AsyncOption<(a: A) => B>) => AsyncOption<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
