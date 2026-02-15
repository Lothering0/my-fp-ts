import * as MonadBoth_ from '../../typeclasses/MonadBoth'
import { _AsyncResult } from './_internal'
import { AsyncResult, Hkt } from './async-result'

export const MonadBoth: MonadBoth_.MonadBoth<Hkt> = _AsyncResult.MonadBoth

export const flatLeft: {
  <A, B, E>(
    asyncResult: AsyncResult<A, AsyncResult<B, E>>,
  ): AsyncResult<A | B, E>
} = MonadBoth.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => AsyncResult<A, D>,
  ): <B>(asyncResult: AsyncResult<B, E>) => AsyncResult<A | B, D>
} = MonadBoth.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    amb: (e: E1) => AsyncResult<A, E2>,
    bmc: (d: E2) => AsyncResult<A, D>,
  ): (e: E1) => AsyncResult<A, D>
} = MonadBoth.composeLeft
