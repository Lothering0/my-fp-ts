import * as result from "../Result"
import { createApplicative } from "../../types/Applicative"
import { success, execute, SyncResult, SyncResultHKT } from "./sync-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"

export const Applicative = createApplicative<SyncResultHKT> ({
  ...Functor,
  of: success,
  ap: fa => self => () =>
    pipe (
      result.Do,
      result.apS ("a", execute (fa)),
      result.apS ("ab", execute (self)),
      result.map (({ a, ab }) => ab (a)),
    ),
})

export const of: {
  <_, A>(a: A): SyncResult<_, A>
} = Applicative.of

export const ap: {
  <_, A>(
    fa: SyncResult<_, A>,
  ): <B>(self: SyncResult<_, (a: A) => B>) => SyncResult<_, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <_, A, B>(
    fab: SyncResult<_, (a: A) => B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
