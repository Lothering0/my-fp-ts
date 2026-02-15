import { Monad as Monad_ } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { SyncResultHkt, SyncResult } from './sync-result'
import { _SyncResult } from './_internal'

export const Monad: Monad_<SyncResultHkt> = _SyncResult.Monad

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(
    syncResult: SyncResult<SyncResult<A, E2>, E1>,
  ): SyncResult<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => SyncResult<B, E1>,
  ): <E2>(syncResult: SyncResult<A, E2>) => SyncResult<B, E1 | E2>
} = Monad.flatMap

export const andThen: {
  <A, E1>(
    syncResult: SyncResult<A, E1>,
  ): <E2>(selfSyncResult: SyncResult<unknown, E2>) => SyncResult<A, E1 | E2>
} = Monad.andThen

export const compose: {
  <E1, E2, A, B, C>(
    amb: (a: A) => SyncResult<B, E1>,
    bmc: (b: B) => SyncResult<C, E2>,
  ): (a: A) => SyncResult<C, E1 | E2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(syncResult: SyncResult<A, E>) => SyncResult<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(syncResult: SyncResult<A, E>) => SyncResult<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    syncResult: SyncResult<(a: A) => B, E1>,
  ): <E2>(
    selfSyncResult: SyncResult<A, E2>,
  ) => SyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    syncResult: SyncResult<B, E1>,
  ): <E2>(
    selfSyncResult: SyncResult<A, E2>,
  ) => SyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncResult<B, E1>,
  ): <E2>(
    syncResult: SyncResult<A, E2>,
  ) => SyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo
