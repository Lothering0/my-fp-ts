import * as Result from '../Result'
import { Monad as Monad_ } from '../../typeclasses/Monad'
import { AsyncResultHkt, AsyncResult, toPromise } from './async-result'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { _AsyncResult } from './_internal'

export const Monad: Monad_<AsyncResultHkt> = _AsyncResult.Monad

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(
    asyncResult: AsyncResult<AsyncResult<A, E2>, E1>,
  ): AsyncResult<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => AsyncResult<B, E1>,
  ): <E2>(asyncResult: AsyncResult<A, E2>) => AsyncResult<B, E1 | E2>
} = Monad.flatMap

export const andThen: {
  <A, E1>(
    asyncResult: AsyncResult<A, E1>,
  ): <E2>(selfAsyncResult: AsyncResult<unknown, E2>) => AsyncResult<A, E1 | E2>
} = Monad.andThen

export const compose: {
  <E1, E2, A, B, C>(
    amb: (a: A) => AsyncResult<B, E1>,
    bmc: (b: B) => AsyncResult<C, E2>,
  ): (a: A) => AsyncResult<C, E1 | E2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(asyncResult: AsyncResult<A, E>) => AsyncResult<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(asyncResult: AsyncResult<A, E>) => AsyncResult<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    asyncResult: AsyncResult<(a: A) => B, E1>,
  ): <E2>(
    selfAsyncResult: AsyncResult<A, E2>,
  ) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    asyncResult: AsyncResult<B, E1>,
  ): <E2>(
    selfAsyncResult: AsyncResult<A, E2>,
  ) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncResult<B, E1>,
  ): <E2>(
    asyncResult: AsyncResult<A, E2>,
  ) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, A, E1>(
    asyncResult: AsyncResult<A, E1>,
  ): <A, E2>(
    selfAsyncResult: AsyncResult<A, E2>,
  ) => AsyncResult<DoObject<N, A, A>, E1 | E2>
} = asyncResult => selfAsyncResult => () =>
  Promise.all([toPromise(selfAsyncResult), toPromise(asyncResult)]).then(
    ([ma, mb]) => pipe(mb, Result.andThen(ma) as any),
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    asyncResult: AsyncResult<B, E1>,
  ): <E2>(
    selfAsyncResult: AsyncResult<A, E1>,
  ) => AsyncResult<DoObject<N, A, B>, E1 | E2>
} = (name, asyncResult) => selfAsyncResult => () =>
  Promise.all([toPromise(selfAsyncResult), toPromise(asyncResult)]).then(
    ([ma, mb]) => Result.bind(name, mb)(ma),
  )
