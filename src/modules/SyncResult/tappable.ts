import * as result from "../Result"
import { Sync } from "../Sync"
import { Monad } from "./monad"
import { execute, SyncResult } from "./sync-result"
import { pipe } from "../../utils/flow"
import { createTappable } from "../../types/Tappable"

export const Tappable = createTappable (Monad)

export const tap: {
  <E1, A>(
    f: (a: A) => SyncResult<E1, unknown>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, A>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): <E>(self: SyncResult<E, A>) => SyncResult<E, A>
} = Tappable.tapSync

export const tapResult: {
  <E1, A>(
    f: (a: A) => result.Result<E1, unknown>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, A>
} = f => self => () => pipe (self, execute, result.tap (f))
