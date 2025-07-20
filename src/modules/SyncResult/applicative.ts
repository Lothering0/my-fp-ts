import * as R from "../Result"
import { createApplicative } from "../../types/Applicative"
import { success, execute, SyncResult, SyncResultHKT } from "./sync-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<SyncResultHKT> ({
  ...Functor,
  of: success,
  ap: overload (
    1,
    <_, A, B>(
      self: SyncResult<_, (a: A) => B>,
      fa: SyncResult<_, A>,
    ): SyncResult<_, B> =>
      () =>
        pipe (
          R.Do,
          R.apS ("a", execute (fa)),
          R.apS ("ab", execute (self)),
          R.map (({ a, ab }) => ab (a)),
        ),
  ),
})

export const of: {
  <_, A>(a: A): SyncResult<_, A>
} = Applicative.of

export const ap: {
  <_, A, B>(
    fa: SyncResult<_, A>,
  ): (self: SyncResult<_, (a: A) => B>) => SyncResult<_, B>
  <_, A, B>(
    self: SyncResult<_, (a: A) => B>,
    fa: SyncResult<_, A>,
  ): SyncResult<_, B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <_, A, B>(
    fa: SyncResult<_, A>,
  ): (self: SyncResult<_, (a: A) => B>) => SyncResult<_, B>
  <_, A, B>(
    self: SyncResult<_, (a: A) => B>,
    fa: SyncResult<_, A>,
  ): SyncResult<_, B>
} = Applicative.apply

export const flap: {
  <_, A, B>(
    fab: SyncResult<_, (a: A) => B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, B>
  <_, A, B>(
    self: SyncResult<_, A>,
    fab: SyncResult<_, (a: A) => B>,
  ): SyncResult<_, B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <_, A, B>(
    fab: SyncResult<_, (a: A) => B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, B>
  <_, A, B>(
    self: SyncResult<_, A>,
    fab: SyncResult<_, (a: A) => B>,
  ): SyncResult<_, B>
} = Applicative.flipApply
