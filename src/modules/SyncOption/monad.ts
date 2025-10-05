import * as Option from '../Option'
import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { SyncOptionHkt, execute, SyncOption } from './sync-option'
import { FromIdentity } from './from-identity'

export const Monad = create<SyncOptionHkt>(FromIdentity, Functor, {
  flat: self => () =>
    pipe(self, execute, ma =>
      Option.isNone(ma) ? ma : pipe(ma, Option.value, execute),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: SyncOption<SyncOption<A>>): SyncOption<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => SyncOption<B>): (self: SyncOption<A>) => SyncOption<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => SyncOption<C>,
    amb: (a: A) => SyncOption<B>,
  ): (a: A) => SyncOption<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: SyncOption<(a: A) => B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo
