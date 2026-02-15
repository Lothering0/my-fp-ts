import * as Zippable_ from '../../typeclasses/Zippable'
import { AsyncResult, Hkt } from './async-result'
import { _AsyncResult } from './_internal'

export const Zippable: Zippable_.Zippable<Hkt> = _AsyncResult.Zippable

export const zipWith: {
  <A, B, D, C>(
    asyncResult: AsyncResult<B, D>,
    f: (a: A, b: B) => C,
  ): <E>(selfAsyncResult: AsyncResult<A, E>) => AsyncResult<C, E | D>
} = Zippable.zipWith

export const zip: {
  <A, B, D>(
    asyncResult: AsyncResult<B, D>,
  ): <E>(
    selfAsyncResult: AsyncResult<A, E>,
  ) => AsyncResult<readonly [A, B], E | D>
} = Zippable.zip

export const unzip: {
  <A, B, E>(
    zipped: AsyncResult<readonly [A, B], E>,
  ): readonly [AsyncResult<A, E>, AsyncResult<B, E>]
} = Zippable.unzip
