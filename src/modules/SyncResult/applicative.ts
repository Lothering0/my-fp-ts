import { Applicative as Applicative_ } from '../../typeclasses/Applicative'
import { SyncResult, Hkt } from './sync-result'
import { _SyncResult } from './_internal'

export const Applicative: Applicative_<Hkt> = _SyncResult.Applicative

export const apply: {
  <A, E1>(
    syncResult: SyncResult<A, E1>,
  ): <B, E2>(
    selfSyncResult: SyncResult<(a: A) => B, E2>,
  ) => SyncResult<B, E1 | E2>
} = Applicative.apply

export const flipApply: {
  <A, B, E1>(
    syncResult: SyncResult<(a: A) => B, E1>,
  ): <E2>(selfSyncResult: SyncResult<A, E2>) => SyncResult<B, E1 | E2>
} = Applicative.flipApply
