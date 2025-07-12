import * as O from "../Option"
import { createApplicative } from "../../types/Applicative"
import {
  AsyncOptionHKT,
  some,
  fromAsyncOption,
  AsyncOption,
} from "./async-option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<AsyncOptionHKT> ({
  ...Functor,
  of: some,
  ap: overload (
    1,
    <A, B>(
      self: AsyncOption<(a: A) => B>,
      fma: AsyncOption<A>,
    ): AsyncOption<B> =>
      () =>
        Promise.all ([fromAsyncOption (self), fromAsyncOption (fma)]).then (
          ([mab, ma]) =>
            pipe (
              O.Do,
              O.apS ("a", ma),
              O.apS ("ab", mab),
              O.map (({ ab, a }) => ab (a)),
            ),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = Applicative
