import * as R from "../Result"
import { createApplicative } from "../../types/Applicative"
import {
  success,
  fromSyncResult,
  SyncResult,
  SyncResultHKT,
} from "./sync-result"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "src/utils/overloads"

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
          R.apS ("a", fromSyncResult (fa)),
          R.apS ("ab", fromSyncResult (self)),
          R.map (({ a, ab }) => ab (a)),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = Applicative
