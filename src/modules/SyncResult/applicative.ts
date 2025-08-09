import * as result from "../Result"
import { createApplicative } from "../../types/Applicative"
import { succeed, execute, SyncResult, SyncResultHkt } from "./sync-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"

export const Applicative = createApplicative<SyncResultHkt> ({
  ...Functor,
  of: succeed,
  ap: fa => self => () =>
    pipe (
      result.Do,
      result.apS ("a", execute (fa)),
      result.apS ("ab", execute (self)),
      result.map (({ a, ab }) => ab (a)),
    ),
})

export const of: {
  <A>(a: A): SyncResult<never, A>
} = Applicative.of

export const ap: {
  <E1, A>(
    fa: SyncResult<E1, A>,
  ): <E2, B>(self: SyncResult<E2, (a: A) => B>) => SyncResult<E1 | E2, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <E1, A, B>(
    fab: SyncResult<E1, (a: A) => B>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
