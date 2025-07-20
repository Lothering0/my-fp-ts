import * as R from "../Result"
import { createApplicative } from "../../types/Applicative"
import { AsyncResultHKT, success, toPromise, AsyncResult } from "./async-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<AsyncResultHKT> ({
  ...Functor,
  of: success,
  ap: overload (
    1,
    <_, A, B>(
      self: AsyncResult<_, (a: A) => B>,
      fma: AsyncResult<_, A>,
    ): AsyncResult<_, B> =>
      () =>
        Promise.all ([toPromise (self), toPromise (fma)]).then (([mab, ma]) =>
          pipe (
            R.Do,
            R.apS ("a", ma),
            R.apS ("ab", mab),
            R.map (({ ab, a }) => ab (a)),
          ),
        ),
  ),
})

export const of: {
  <_, A>(a: A): AsyncResult<_, A>
} = Applicative.of

export const ap: {
  <_, A, B>(
    fa: AsyncResult<_, A>,
  ): (self: AsyncResult<_, (a: A) => B>) => AsyncResult<_, B>
  <_, A, B>(
    self: AsyncResult<_, (a: A) => B>,
    fa: AsyncResult<_, A>,
  ): AsyncResult<_, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <_, A, B>(
    fa: AsyncResult<_, A>,
  ): (self: AsyncResult<_, (a: A) => B>) => AsyncResult<_, B>
  <_, A, B>(
    self: AsyncResult<_, (a: A) => B>,
    fa: AsyncResult<_, A>,
  ): AsyncResult<_, B>
} = Applicative.apply

export const flap: {
  <_, A, B>(
    fab: AsyncResult<_, (a: A) => B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, B>
  <_, A, B>(
    self: AsyncResult<_, A>,
    fab: AsyncResult<_, (a: A) => B>,
  ): AsyncResult<_, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <_, A, B>(
    fab: AsyncResult<_, (a: A) => B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, B>
  <_, A, B>(
    self: AsyncResult<_, A>,
    fab: AsyncResult<_, (a: A) => B>,
  ): AsyncResult<_, B>
} = Applicative.flipApply
