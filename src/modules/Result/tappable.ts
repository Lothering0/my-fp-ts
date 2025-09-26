import * as tappableBoth from '../../typeclasses/TappableBoth'
import * as sync from '../Sync'
import { create } from '../../typeclasses/Tappable'
import { Monad } from './monad'
import { fail, Result, ResultHkt, succeed } from './result'
import { pipe } from '../../utils/flow'
import { match } from './matchers'

export const Tappable = create(Monad)

export const TappableBoth: tappableBoth.TappableBoth<ResultHkt> = {
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
      onFailure: e => pipe(e, f, sync.execute, () => fail(e)),
      onSuccess: succeed,
    }),
}

export const tap: {
  <E1, A>(
    f: (a: A) => Result<E1, unknown>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => sync.Sync<unknown>): <E>(self: Result<E, A>) => Result<E, A>
} = Tappable.tapSync

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => Result<E2, unknown>,
  ): <A>(self: Result<E1, A>) => Result<E1 | E2, A>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(f: (e: E) => sync.Sync<unknown>): <A>(self: Result<E, A>) => Result<E, A>
} = TappableBoth.tapLeftSync
