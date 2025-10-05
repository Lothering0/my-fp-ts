/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Option from '../Option'
import { create } from '../../typeclasses/Monad'
import { AsyncOptionHkt, AsyncOption, toPromise } from './async-option'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'

export const Monad = create<AsyncOptionHkt>(FromIdentity, Functor, {
  flat: self => () =>
    toPromise(self).then(ma =>
      Option.isNone(ma) ? ma : pipe(ma, Option.value, toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: AsyncOption<AsyncOption<A>>): AsyncOption<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => AsyncOption<C>,
    amb: (a: A) => AsyncOption<B>,
  ): (a: A) => AsyncOption<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, B>(
    fb: AsyncOption<B>,
  ): <A>(fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = fb => fa => () =>
  Promise.all([toPromise(fa), toPromise(fb)]).then(([ma, mb]) =>
    pipe(
      mb,
      Option.flatMap(() => ma as any),
    ),
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = (name, fb) => fa => () =>
  Promise.all([toPromise(fa), toPromise(fb)]).then(([ma, mb]) =>
    Option.bind(name, mb)(ma),
  )
