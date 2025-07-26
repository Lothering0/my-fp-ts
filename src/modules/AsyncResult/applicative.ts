import * as R from "../Result"
import { createApplicative } from "../../types/Applicative"
import { AsyncResultHKT, success, toPromise, AsyncResult } from "./async-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"

export const Applicative = createApplicative<AsyncResultHKT> ({
  ...Functor,
  of: success,
  ap: fma => self => () =>
    Promise.all ([toPromise (self), toPromise (fma)]).then (([mab, ma]) =>
      pipe (
        R.Do,
        R.apS ("a", ma),
        R.apS ("ab", mab),
        R.map (({ ab, a }) => ab (a)),
      ),
    ),
})

export const of: {
  <_, A>(a: A): AsyncResult<_, A>
} = Applicative.of

export const ap: {
  <_, A>(
    fa: AsyncResult<_, A>,
  ): <B>(self: AsyncResult<_, (a: A) => B>) => AsyncResult<_, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <_, A, B>(
    fab: AsyncResult<_, (a: A) => B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
