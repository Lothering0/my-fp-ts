import * as Async from './async'
import { create } from '../../typeclasses/Monad'
import { Functor } from './functor'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'

export const Monad = create<Async.AsyncHkt>(FromIdentity, Functor, {
  // `Promise.resolve` for recursion optimization
  flat: async => () => Promise.resolve().then(async).then(Async.toPromise),
})

export const Do = Monad.Do

export const flat: {
  <A>(async: Async.Async<Async.Async<A>>): Async.Async<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => Async.Async<B>,
  ): (async: Async.Async<A>) => Async.Async<B>
} = Monad.flatMap

export const andThen: {
  <A>(
    async: Async.Async<A>,
  ): (selfAsync: Async.Async<unknown>) => Async.Async<A>
} = Monad.andThen

export const compose: {
  <A, B, C>(
    amb: (a: A) => Async.Async<B>,
    bmc: (b: B) => Async.Async<C>,
  ): (a: A) => Async.Async<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (async: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (async: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Async.Async<(a: A) => B>,
  ): (async: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    async: Async.Async<B>,
  ): (selfAsync: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Async.Async<B>,
  ): (async: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, A, B>(
    async: Async.Async<B>,
  ): (selfAsync: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = async => selfAsync => () =>
  Promise.all([Async.toPromise(selfAsync), Async.toPromise(async)]).then(
    ([a]) => a as any,
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    async: Async.Async<B>,
  ): (selfAsync: Async.Async<A>) => Async.Async<DoObject<N, A, B>>
} = (name, async) => selfAsync => () =>
  Promise.all([Async.toPromise(selfAsync), Async.toPromise(async)]).then(
    ([a, b]) => ({ [name]: b, ...a }) as any,
  )
