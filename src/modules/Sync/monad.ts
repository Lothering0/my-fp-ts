import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Functor } from './functor'
import { SyncHkt, Sync, run } from './sync'

export const Monad = create<SyncHkt>(FromIdentity, Functor, {
  flat: run,
})

export const Do = Monad.Do

export const flat: {
  <A>(sync: Sync<Sync<A>>): Sync<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => Sync<B>): (sync: Sync<A>) => Sync<B>
} = Monad.flatMap

export const andThen: {
  <A>(sync: Sync<A>): (selfSync: Sync<unknown>) => Sync<A>
} = Monad.andThen

export const compose: {
  <A, B, C>(amb: (a: A) => Sync<B>, bmc: (b: B) => Sync<C>): (a: A) => Sync<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (sync: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (sync: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    sync: Sync<(a: A) => B>,
  ): (selfSync: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    sync: Sync<B>,
  ): (selfSync: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Sync<B>,
  ): (sync: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.flatMapTo
