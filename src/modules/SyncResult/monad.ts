import { Monad as Monad_ } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { SyncResultHkt, SyncResult } from './sync-result'
import { _SyncResult } from './_internal'

export const Monad: Monad_<SyncResultHkt> = _SyncResult.Monad

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(self: SyncResult<SyncResult<A, E2>, E1>): SyncResult<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => SyncResult<B, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<B, E1 | E2>
} = Monad.flatMap

export const compose: {
  <E1, E2, A, B, C>(
    bmc: (b: B) => SyncResult<C, E2>,
    amb: (a: A) => SyncResult<B, E1>,
  ): (a: A) => SyncResult<C, E1 | E2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(self: SyncResult<A, E>) => SyncResult<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: SyncResult<A, E>) => SyncResult<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fab: SyncResult<(a: A) => B, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fb: SyncResult<B, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncResult<B, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo
