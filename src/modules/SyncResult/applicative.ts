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

export const { of, ap, apply, flap, flipApply } = Applicative
