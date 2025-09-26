import * as result from "../Result"
import { create } from "../../typeclasses/Applicative"
import { AsyncResultHkt, succeed, toPromise, AsyncResult } from "./async-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"

export const Applicative = create<AsyncResultHkt> (Functor, {
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
  <Out>(a: Out): AsyncResult<never, Out>
} = Applicative.of

export const ap: {
  <Failure1, In>(
    fa: AsyncResult<Failure1, In>,
  ): <Failure2, Out>(
    self: AsyncResult<Failure2, (a: In) => Out>,
  ) => AsyncResult<Failure1 | Failure2, Out>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <Failure1, In, Out>(
    fab: AsyncResult<Failure1, (a: In) => Out>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, Out>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
