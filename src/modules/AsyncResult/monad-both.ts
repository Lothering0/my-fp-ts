import * as MonadBoth_ from '../../typeclasses/MonadBoth'
import { _AsyncResult } from './_internal'
import { AsyncResult, AsyncResultHkt } from './async-result'

export const MonadBoth: MonadBoth_.MonadBoth<AsyncResultHkt> =
  _AsyncResult.MonadBoth

export const flatLeft: {
  <A, B, E>(self: AsyncResult<A, AsyncResult<B, E>>): AsyncResult<A | B, E>
} = MonadBoth.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => AsyncResult<A, D>,
  ): <B>(self: AsyncResult<B, E>) => AsyncResult<A | B, D>
} = MonadBoth.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    bmc: (d: E2) => AsyncResult<A, D>,
    amb: (e: E1) => AsyncResult<A, E2>,
  ): (e: E1) => AsyncResult<A, D>
} = MonadBoth.composeLeft
