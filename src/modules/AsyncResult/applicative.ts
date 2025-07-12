import * as R from "../Result"
import { createApplicative } from "../../types/Applicative"
import {
  AsyncResultHKT,
  success,
  fromAsyncResult,
  AsyncResult,
} from "./async-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "../../utils/overloads"

export const applicative = createApplicative<AsyncResultHKT> ({
  ...Functor,
  of: success,
  ap: overload (
    1,
    <_, A, B>(
      self: AsyncResult<_, (a: A) => B>,
      fma: AsyncResult<_, A>,
    ): AsyncResult<_, B> =>
      () =>
        Promise.all ([fromAsyncResult (self), fromAsyncResult (fma)]).then (
          ([mab, ma]) =>
            pipe (
              R.Do,
              R.apS ("a", ma),
              R.apS ("ab", mab),
              R.map (({ ab, a }) => ab (a)),
            ),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative
