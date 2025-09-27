import * as Result from '../Result'
import { create } from '../../typeclasses/Applicative'
import { succeed, execute, SyncResult, SyncResultHkt } from './sync-result'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'

export const Applicative = create<SyncResultHkt>(Functor, {
  of: succeed,
  ap: fa => self => () =>
    pipe(
      Result.Do,
      Result.apS('a', execute(fa)),
      Result.apS('ab', execute(self)),
      Result.map(({ a, ab }) => ab(a)),
    ),
})

export const of: {
  <A>(a: A): SyncResult<A>
} = Applicative.of

export const ap: {
  <A, E1>(
    fa: SyncResult<A, E1>,
  ): <B, E2>(self: SyncResult<(a: A) => B, E2>) => SyncResult<B, E1 | E2>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B, E1>(
    fab: SyncResult<(a: A) => B, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<B, E1 | E2>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
