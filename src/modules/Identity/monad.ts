import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Functor } from './functor'
import { Identity, IdentityHkt, identity } from './identity'

export const Monad = create<IdentityHkt>(FromIdentity, Functor, {
  flat: identity,
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Identity<Identity<A>>): Identity<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => Identity<B>): (self: Identity<A>) => Identity<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => Identity<C>,
    amb: (a: A) => Identity<B>,
  ): (a: A) => Identity<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Identity<(a: A) => B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Identity<B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Identity<B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.flatMapTo
