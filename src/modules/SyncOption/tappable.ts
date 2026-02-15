import * as SyncResult from '../SyncResult'
import * as Option from '../Option'
import { Sync } from '../Sync'
import { Result } from '../Result'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { Tappable as Tappable_ } from '../../typeclasses/Tappable'
import { _SyncOption } from './_internal'

export const Tappable: Tappable_<SyncOptionHkt> = _SyncOption.Tappable

export const tap: {
  <A>(
    f: (a: A) => SyncOption<unknown>,
  ): (syncOption: SyncOption<A>) => SyncOption<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (syncOption: SyncOption<A>) => SyncOption<A>
} = Tappable.tapSync

export const tapOption: {
  <A>(
    f: (a: A) => Option.Option<unknown>,
  ): (syncOption: SyncOption<A>) => SyncOption<A>
} = _SyncOption.tapOption

export const tapResult: {
  <E, A>(
    f: (a: A) => Result<E, unknown>,
  ): (syncOption: SyncOption<A>) => SyncOption<A>
} = _SyncOption.tapResult

export const tapSyncResult: {
  <E, A>(
    f: (a: A) => SyncResult.SyncResult<E, unknown>,
  ): (syncOption: SyncOption<A>) => SyncOption<A>
} = _SyncOption.tapSyncResult
