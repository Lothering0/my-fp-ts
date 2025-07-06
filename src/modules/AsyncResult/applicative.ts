import * as R from "../Result"
import { Applicative, createApplicative } from "../../types/Applicative"
import {
  AsyncResultHKT,
  success,
  fromAsyncResult,
  AsyncResult,
} from "./async-result"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<AsyncResultHKT> = createApplicative ({
  ...functor,
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
