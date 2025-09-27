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
  <A, E1>(
    f: (a: A) => SyncResult<unknown, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<A, E1 | E2>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): <E>(self: SyncResult<A, E>) => SyncResult<A, E>
} = Tappable.tapSync

export const tapResult: {
  <A, E1>(
    f: (a: A) => Result.Result<unknown, E1>,
  ): <E2>(self: SyncResult<A, E2>) => SyncResult<A, E1 | E2>
} = f => self => () => pipe(self, execute, Result.tap(f))

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => SyncResult<unknown, E2>,
  ): <A>(self: SyncResult<A, E1>) => SyncResult<A, E1 | E2>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => Sync<unknown>,
  ): <A>(self: SyncResult<A, E>) => SyncResult<A, E>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => Result.Result<unknown, E2>,
  ): <A>(self: SyncResult<A, E1>) => SyncResult<A, E1 | E2>
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
