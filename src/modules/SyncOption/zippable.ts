import * as Zippable_ from '../../typeclasses/Zippable'
import { _SyncOption } from './_internal'
import { SyncOption, SyncOptionHkt } from './sync-option'

export const Zippable: Zippable_.Zippable<SyncOptionHkt> = _SyncOption.Zippable

export const zipWith: {
  <A, B, C>(
    syncOption: SyncOption<B>,
    f: (a: A, b: B) => C,
  ): (selfSyncOption: SyncOption<A>) => SyncOption<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(
    syncOption: SyncOption<B>,
  ): (selfSyncOption: SyncOption<A>) => SyncOption<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(
    zipped: SyncOption<readonly [A, B]>,
  ): readonly [SyncOption<A>, SyncOption<B>]
} = Zippable.unzip
