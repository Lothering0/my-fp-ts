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
  <A>(a: Identity<Identity<A>>): Identity<A>
} = Monad.flat

export const flatMap: {
  <A, B>(ab: (a: A) => Identity<B>): (a: Identity<A>) => Identity<B>
} = Monad.flatMap

export const andThen: {
  <A>(a: Identity<A>): (x: Identity<unknown>) => Identity<A>
} = Monad.andThen

export const compose: {
  <A, B, C>(
    ab: (a: A) => Identity<B>,
    bc: (b: B) => Identity<C>,
  ): (a: A) => Identity<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (a: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (a: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: Identity<(a: A) => B>,
  ): (a: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: Identity<B>,
  ): (a: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => Identity<B>,
  ): (a: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.flatMapTo
