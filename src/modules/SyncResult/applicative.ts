import { create } from '../../typeclasses/Applicative'
import { SyncResult, SyncResultHkt } from './sync-result'
import { Monad } from './monad'

export const Applicative = create<SyncResultHkt>(Monad)

export const apply: {
  <A, E1>(
    fa: SyncResult<A, E1>,
  ): <B, E2>(self: SyncResult<(a: A) => B, E2>) => SyncResult<B, E1 | E2>
} = Applicative.apply

export const flipApply: {
  <A, B, E1>(
    fab: SyncResult<(a: A) => B, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<B, E1 | E2>
} = Applicative.flipApply
