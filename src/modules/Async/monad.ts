/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Async from './async'
import { create } from '../../typeclasses/Monad'
import { Functor } from './functor'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'

export const Monad = create<Async.AsyncHkt>(FromIdentity, Functor, {
  flat: self => () => Async.toPromise(self).then(Async.toPromise),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Async.Async<Async.Async<A>>): Async.Async<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => Async.Async<B>,
  ): (self: Async.Async<A>) => Async.Async<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => Async.Async<C>,
    amb: (a: A) => Async.Async<B>,
  ): (a: A) => Async.Async<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Async.Async<(a: A) => B>,
  ): (self: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Async.Async<B>,
  ): (self: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Async.Async<B>,
  ): (self: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, A, B>(
    fb: Async.Async<B>,
  ): (fa: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = fb => fa => () =>
  Promise.all([Async.toPromise(fa), Async.toPromise(fb)]).then(
    ([a]) => a as any,
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Async.Async<B>,
  ): (fa: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = (name, fb) => fa => () =>
  Promise.all([Async.toPromise(fa), Async.toPromise(fb)]).then(
    ([a, b]) => ({ [name]: b, ...a }) as any,
  )
