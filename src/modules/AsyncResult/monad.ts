/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Result from '../Result'
import * as Async from '../Async'
import { identity } from '../Identity'
import { create } from '../../typeclasses/Monad'
import { Functor } from './functor'
import { AsyncResultHkt, AsyncResult, toPromise, fail } from './async-result'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { match } from './matchers'
import { FromIdentity } from './from-identity'

export const Monad = create<AsyncResultHkt>(FromIdentity, Functor, {
  flat: self => () =>
    pipe(
      self,
      match({ onFailure: fail, onSuccess: identity }),
      Async.toPromise,
      promise => promise.then(toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(
    self: AsyncResult<AsyncResult<A, E2>, E1>,
  ): AsyncResult<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => AsyncResult<B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<B, E1 | E2>
} = Monad.flatMap

export const compose: {
  <E1, E2, A, B, C>(
    bmc: (b: B) => AsyncResult<C, E2>,
    amb: (a: A) => AsyncResult<B, E1>,
  ): (a: A) => AsyncResult<C, E1 | E2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(self: AsyncResult<A, E>) => AsyncResult<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: AsyncResult<A, E>) => AsyncResult<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fab: AsyncResult<(a: A) => B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const apS: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncResult<B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, A, E1>(
    fb: AsyncResult<A, E1>,
  ): <A, E2>(
    self: AsyncResult<A, E2>,
  ) => AsyncResult<DoObject<N, A, A>, E1 | E2>
} = fb => self => () =>
  Promise.all([toPromise(self), toPromise(fb)]).then(([ma, mb]) =>
    pipe(mb, Result.flatMap(() => ma) as any),
  )

export const parallelTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<B, E1>,
  ): <E2>(self: AsyncResult<A, E1>) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = (name, fb) => self => () =>
  Promise.all([toPromise(self), toPromise(fb)]).then(([ma, mb]) =>
    Result.apS(name, mb)(ma),
  )
