import * as R from "../Result"
import * as S from "../Sync"
import { pipe, flow } from "../../utils/flow"
import { execute, SyncResult } from "./sync-result"

export const toUnion: {
  <E, A>(self: SyncResult<E, A>): S.Sync<E | A>
} = self => () => pipe (self, execute, R.toUnion)

export const match: {
  <E, A, B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): (self: SyncResult<E, A>) => S.Sync<B>
} = (onFailure, onSuccess) => flow (execute, R.match (onFailure, onSuccess), S.of)
