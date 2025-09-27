import * as Result from '../Result'
import { create } from '../../typeclasses/Applicative'
import { AsyncResultHkt, succeed, toPromise, AsyncResult } from './async-result'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'

export const Applicative = create<AsyncResultHkt>(Functor, {
  of: succeed,
  ap: fma => self => () =>
    Promise.all([toPromise(self), toPromise(fma)]).then(([mab, ma]) =>
      pipe(
        Result.Do,
        Result.apS('a', ma),
        Result.apS('ab', mab),
        Result.map(({ ab, a }) => ab(a)),
      ),
    ),
})

export const of: {
  <A>(a: A): AsyncResult<A>
} = Applicative.of

export const ap: {
  <A, E1>(
    fa: AsyncResult<A, E1>,
  ): <B, E2>(self: AsyncResult<(a: A) => B, E2>) => AsyncResult<B, E1 | E2>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B, E1>(
    fab: AsyncResult<(a: A) => B, E1>,
  ): <E2>(self: AsyncResult<A, E2>) => AsyncResult<B, E1 | E2>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
