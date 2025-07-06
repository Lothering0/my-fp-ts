import * as R from "../Result"
import { createMonad } from "../../types/Monad"
import { SyncResultHKT, fromSyncResult, SyncResult } from "./sync-result"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const monad = createMonad<SyncResultHKT> ({
  ...applicative,
  flat: self => () =>
    pipe (self, fromSyncResult, ma =>
      R.isFailure (ma) ? ma : pipe (ma, R.fromSuccess, fromSyncResult),
    ),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapSync,
} = monad

export const tapResult: {
  <E, A, _>(
    f: (a: A) => R.Result<E, _>,
  ): (self: SyncResult<E, A>) => SyncResult<E, A>
  <E, A, _>(
    self: SyncResult<E, A>,
    f: (a: A) => R.Result<E, _>,
  ): SyncResult<E, A>
} = overload (1, (self, f) => () => pipe (self, fromSyncResult, R.tap (f)))
