import * as TappableBoth_ from '../../typeclasses/TappableBoth'
import * as Sync from '../Sync'
import * as Functor from './functor'
import { create } from '../../typeclasses/Tappable'
import { Monad, flatMap } from './monad'
import { fail, Result, ResultHkt, succeed } from './result'
import { pipe } from '../../utils/flow'
import { match } from './matchers'

export const Tappable = create(Monad)

export const TappableBoth: TappableBoth_.TappableBoth<ResultHkt> = {
  ...Tappable,
  tapLeft: f =>
    match({
      onFailure: e =>
        pipe(
          e,
          f,
          match({
            onFailure: fail,
            onSuccess: () => fail(e),
          }),
        ),
      onSuccess: succeed,
    }),
  tapLeftSync: f =>
    match({
      onFailure: e => pipe(e, f, Sync.run, () => fail(e)),
      onSuccess: succeed,
    }),
}

export const tap: {
  <A, E1>(
    f: (a: A) => Result<unknown, E1>,
  ): <E2>(self: Result<A, E2>) => Result<A, E1 | E2>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync.Sync<unknown>): <E>(self: Result<A, E>) => Result<A, E>
} = Tappable.tapSync

export const tapSyncResult: {
  <A, E2>(
    f: (a: A) => Sync.Sync<Result<unknown, E2>>,
  ): <E1>(self: Result<A, E1>) => Result<A, E1 | E2>
} = f => flatMap(a => pipe(a, f, g => g(), Functor.as(a)))

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => Result<unknown, E2>,
  ): <A>(self: Result<A, E1>) => Result<A, E1 | E2>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(f: (e: E) => Sync.Sync<unknown>): <A>(self: Result<A, E>) => Result<A, E>
} = TappableBoth.tapLeftSync
