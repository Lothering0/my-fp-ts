import * as result from "../Result"
import * as sync from "../Sync"
import { pipe, flow } from "../../utils/flow"
import { execute, SyncResult } from "./sync-result"

export const toUnion: {
  <E, A>(self: SyncResult<E, A>): sync.Sync<E | A>
} = self => () => pipe (self, execute, result.toUnion)

export const match: {
  <E, A, B, C = B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => C,
  ): (self: SyncResult<E, A>) => sync.Sync<B | C>
} = (onFailure, onSuccess) =>
  flow (execute, result.match (onFailure, onSuccess), sync.of)
