import * as Option from '../Option'
import * as Result from '../Result'
import { Compactable as Compactable_ } from '../../typeclasses/Compactable'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { _SyncOption } from './_internal'

export const Compactable: Compactable_<SyncOptionHkt> = _SyncOption.Compactable

export const compact: {
  <A>(self: SyncOption<Option.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: SyncOption<Result.Result<A, unknown>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    self: SyncOption<Result.Result<A, E>>,
  ): readonly [SyncOption<A>, SyncOption<E>]
} = Compactable.separate
