import { Monad as Monad_ } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Hkt, SyncOption } from './sync-option'
import { _SyncOption } from './_internal'

export const Monad: Monad_<Hkt> = _SyncOption.Monad

export const Do = Monad.Do

export const flat: {
  <A>(syncOption: SyncOption<SyncOption<A>>): SyncOption<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => SyncOption<B>,
  ): (syncOption: SyncOption<A>) => SyncOption<B>
} = Monad.flatMap

export const andThen: {
  <A>(ma: SyncOption<A>): (syncOption: SyncOption<unknown>) => SyncOption<A>
} = Monad.andThen

export const compose: {
  <A, B, C>(
    amb: (a: A) => SyncOption<B>,
    bmc: (b: B) => SyncOption<C>,
  ): (a: A) => SyncOption<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (syncOption: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (syncOption: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    syncOption: SyncOption<(a: A) => B>,
  ): (selfSyncOption: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    syncOption: SyncOption<B>,
  ): (selfSyncOption: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncOption<B>,
  ): (selfSyncOption: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo
