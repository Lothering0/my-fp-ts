import * as R from "../Result"
import { createMonad } from "../../types/Monad"
import { SyncResultHKT, execute, SyncResult } from "./sync-result"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Monad = createMonad<SyncResultHKT> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      R.isFailure (ma) ? ma : pipe (ma, R.fromSuccess, execute),
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
} = Monad

export const tapResult: {
  <E, A, _>(
    f: (a: A) => R.Result<E, _>,
  ): (self: SyncResult<E, A>) => SyncResult<E, A>
  <E, A, _>(
    self: SyncResult<E, A>,
    f: (a: A) => R.Result<E, _>,
  ): SyncResult<E, A>
} = overload (1, (self, f) => () => pipe (self, execute, R.tap (f)))
