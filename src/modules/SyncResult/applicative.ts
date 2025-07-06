import * as R from "../Result"
import { Applicative, createApplicative } from "../../types/Applicative"
import {
  success,
  fromSyncResult,
  SyncResult,
  SyncResultHKT,
} from "./sync-result"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "src/utils/overloads"

export const applicative: Applicative<SyncResultHKT> = createApplicative ({
  ...functor,
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

export const { of, ap, apply, flap, flipApply } = applicative
