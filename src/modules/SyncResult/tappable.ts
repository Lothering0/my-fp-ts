import * as Result from '../Result'
import * as TappableBoth_ from '../../typeclasses/TappableBoth'
import { Sync } from '../Sync'
import { Monad } from './monad'
import { execute, fromSync, SyncResult, SyncResultHkt } from './sync-result'
import { pipe } from '../../utils/flow'
import { create } from '../../typeclasses/Tappable'

export const Tappable = create(Monad)

export const TappableBoth: TappableBoth_.TappableBoth<SyncResultHkt> = {
  ...Tappable,
  tapLeft: f => self => () =>
    pipe(
      self,
      execute,
      Result.match({
        onFailure: e =>
          pipe(
            e,
            f,
            execute,
            Result.match({
              onFailure: Result.fail,
              onSuccess: () => Result.fail(e),
            }),
          ),
        onSuccess: Result.succeed,
      }),
    ),
  tapLeftSync: f => self => () =>
    pipe(
      self,
      execute,
      Result.match({
        onFailure: e => pipe(e, f, fromSync, execute, () => Result.fail(e)),
        onSuccess: Result.succeed,
      }),
    ),
}

export const tap: {
  <E1, A>(
    f: (a: A) => SyncResult<E1, unknown>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, A>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): <E>(self: SyncResult<E, A>) => SyncResult<E, A>
} = Tappable.tapSync

export const tapResult: {
  <E1, A>(
    f: (a: A) => Result.Result<E1, unknown>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, A>
} = f => self => () => pipe(self, execute, Result.tap(f))

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => SyncResult<E2, unknown>,
  ): <A>(self: SyncResult<E1, A>) => SyncResult<E1 | E2, A>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => Sync<unknown>,
  ): <A>(self: SyncResult<E, A>) => SyncResult<E, A>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => Result.Result<E2, unknown>,
  ): <A>(self: SyncResult<E1, A>) => SyncResult<E1 | E2, A>
} = f => self => () =>
  pipe(
    self,
    execute,
    Result.match({
      onFailure: e =>
        pipe(
          e,
          f,
          Result.match({
            onFailure: Result.fail,
            onSuccess: () => Result.fail(e),
          }),
        ),
      onSuccess: Result.succeed,
    }),
  )
