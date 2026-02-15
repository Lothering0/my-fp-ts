import { Applicative as Applicative_ } from '../../typeclasses/Applicative'
import { SyncOptionHkt, SyncOption } from './sync-option'
import { _SyncOption } from './_internal'

export const Applicative: Applicative_<SyncOptionHkt> = _SyncOption.Applicative

export const apply: {
  <A>(
    syncOption: SyncOption<A>,
  ): <B>(selfSyncOption: SyncOption<(a: A) => B>) => SyncOption<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(
    syncOption: SyncOption<(a: A) => B>,
  ): (selfSyncOption: SyncOption<A>) => SyncOption<B>
} = Applicative.flipApply
