import * as Option from '../Option'
import * as Result from '../Result'
import { Compactable as Compactable_ } from '../../typeclasses/Compactable'
import { SyncOption, Hkt } from './sync-option'
import { _SyncOption } from './_internal'

export const Compactable: Compactable_<Hkt> = _SyncOption.Compactable

export const compact: {
  <A>(syncOption: SyncOption<Option.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(syncOption: SyncOption<Result.Result<A, unknown>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    syncOption: SyncOption<Result.Result<A, E>>,
  ): readonly [SyncOption<A>, SyncOption<E>]
} = Compactable.separate
