import * as SyncResult from '../SyncResult'
import * as Option from '../Option'
import { Sync } from '../Sync'
import { Result } from '../Result'
import { Monad } from './monad'
import { pipe } from '../../utils/flow'
import { execute, SyncOption } from './sync-option'
import { create } from '../../typeclasses/Tappable'

export const Tappable = create(Monad)

export const tap: {
  <A>(f: (a: A) => SyncOption<unknown>): (self: SyncOption<A>) => SyncOption<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: SyncOption<A>) => SyncOption<A>
} = Tappable.tapSync

export const tapOption: {
  <A>(
    f: (a: A) => Option.Option<unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () => pipe(self, execute, Option.tap(f))

export const tapResult: {
  <E, A>(
    f: (a: A) => Result<E, unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () => pipe(self, execute, Option.tapResult(f))

export const tapSyncResult: {
  <E, A>(
    f: (a: A) => SyncResult.SyncResult<E, unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () =>
  pipe(
    self,
    execute,
    Option.tap(a => pipe(a, f, SyncResult.execute, Option.fromResult)),
  )
