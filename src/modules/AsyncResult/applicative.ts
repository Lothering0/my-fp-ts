import * as Result from '../Result'
import { Applicative as Applicative_ } from '../../typeclasses/Applicative'
import { AsyncResultHkt, toPromise, AsyncResult } from './async-result'
import { pipe } from '../../utils/flow'
import { flip } from '../../utils/flip'
import { _AsyncResult } from './_internal'

export const Applicative: Applicative_<AsyncResultHkt> =
  _AsyncResult.Applicative

export const apply: {
  <A, E1>(
    fa: AsyncResult<A, E1>,
  ): <B, E2>(self: AsyncResult<(a: A) => B, E2>) => AsyncResult<B, E1 | E2>
} = Applicative.apply

export const applyConcurrenty: {
  <A, E1>(
    fa: AsyncResult<A, E1>,
  ): <B, E2>(self: AsyncResult<(a: A) => B, E2>) => AsyncResult<B, E1 | E2>
} = fma => self => () =>
  Promise.all([toPromise(self), toPromise(fma)]).then(([mab, ma]) =>
    pipe(
      Result.Do,
      Result.bind('a', ma),
      Result.bind('ab', mab),
      Result.map(({ ab, a }) => ab(a)),
    ),
  )

export const flipApply: {
  <A, B, E1>(
    fab: AsyncResult<(a: A) => B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<B, E1 | E2>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B, E1>(
    fab: AsyncResult<(a: A) => B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<B, E1 | E2>
} = flip(applyConcurrenty) as typeof flipApplyConcurrently
