import * as R from "../Result"
import * as S from "../Sync"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { fromSyncResult, SyncResult } from "./sync-result"

export const toUnion: {
  <E, A>(ma: SyncResult<E, A>): S.Sync<E | A>
} = mma => () => R.toUnion (mma ())

export const match: {
  <E, A, B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): (self: SyncResult<E, A>) => S.Sync<B>
  <E, A, B>(
    self: SyncResult<E, A>,
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): S.Sync<B>
} = overload (2, (self, onFailure, onSuccess) =>
  pipe (self, fromSyncResult, R.match (onFailure, onSuccess), S.of),
)
