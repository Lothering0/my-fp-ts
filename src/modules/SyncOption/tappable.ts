import * as syncResult from "../SyncResult"
import * as option from "../Option"
import { Sync } from "../Sync"
import { Result } from "../Result"
import { Monad } from "./monad"
import { pipe } from "../../utils/flow"
import { execute, SyncOption } from "./sync-option"
import { createTappable } from "../../types/Tappable"

export const Tappable = createTappable (Monad)

export const tap: {
  <A>(f: (a: A) => SyncOption<unknown>): (self: SyncOption<A>) => SyncOption<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: SyncOption<A>) => SyncOption<A>
} = Tappable.tapSync

export const tapOption: {
  <A>(
    f: (a: A) => option.Option<unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () => pipe (self, execute, option.tap (f))

export const tapResult: {
  <E, A>(
    f: (a: A) => Result<E, unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () => pipe (self, execute, option.tapResult (f))

export const tapSyncResult: {
  <E, A>(
    f: (a: A) => syncResult.SyncResult<E, unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () =>
  pipe (
    self,
    execute,
    option.tap (a => pipe (a, f, syncResult.execute, option.fromResult)),
  )
