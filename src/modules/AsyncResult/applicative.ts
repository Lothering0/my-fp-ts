import * as result from "../Result"
import { createApplicative } from "../../types/Applicative"
import { AsyncResultHkt, succeed, toPromise, AsyncResult } from "./async-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"

export const Applicative = createApplicative<AsyncResultHkt> ({
  ...Functor,
  of: succeed,
  ap: fma => self => () =>
    Promise.all ([toPromise (self), toPromise (fma)]).then (([mab, ma]) =>
      pipe (
        result.Do,
        result.apS ("a", ma),
        result.apS ("ab", mab),
        result.map (({ ab, a }) => ab (a)),
      ),
    ),
})

export const of: {
  <A>(a: A): AsyncResult<never, A>
} = Applicative.of

export const ap: {
  <E1, A>(
    fa: AsyncResult<E1, A>,
  ): <E2, B>(self: AsyncResult<E2, (a: A) => B>) => AsyncResult<E1 | E2, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <E1, A, B>(
    fab: AsyncResult<E1, (a: A) => B>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
