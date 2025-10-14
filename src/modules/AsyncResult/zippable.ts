import * as Zippable_ from '../../typeclasses/Zippable'
import { AsyncResult, AsyncResultHkt } from './async-result'
import { _AsyncResult } from './internal'

export const Zippable: Zippable_.Zippable<AsyncResultHkt> =
  _AsyncResult.Zippable

export const zipWith: {
  <A, B, D, C>(
    that: AsyncResult<B, D>,
    f: (a: A, b: B) => C,
  ): <E>(self: AsyncResult<A, E>) => AsyncResult<C, E | D>
} = Zippable.zipWith

export const zip: {
  <A, B, D>(
    that: AsyncResult<B, D>,
  ): <E>(self: AsyncResult<A, E>) => AsyncResult<readonly [A, B], E | D>
} = Zippable.zip

export const unzip: {
  <A, B, E>(
    zipped: AsyncResult<readonly [A, B], E>,
  ): readonly [AsyncResult<A, E>, AsyncResult<B, E>]
} = Zippable.unzip
