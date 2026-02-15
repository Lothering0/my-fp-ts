import * as Result from '../Result'
import * as TappableBoth_ from '../../typeclasses/TappableBoth'
import { Sync } from '../Sync'
import { run, fromSync, SyncResult, SyncResultHkt } from './sync-result'
import { pipe } from '../../utils/flow'
import { Tappable as Tappable_ } from '../../typeclasses/Tappable'
import { _SyncResult } from './_internal'

export const Tappable: Tappable_<SyncResultHkt> = _SyncResult.Tappable

export const TappableBoth: TappableBoth_.TappableBoth<SyncResultHkt> = {
  ...Tappable,
  tapLeft: f => syncResult => () =>
    pipe(
      syncResult,
      run,
      Result.match({
        onFailure: e =>
          pipe(
            e,
            f,
            run,
            Result.match({
              onFailure: Result.fail,
              onSuccess: () => Result.fail(e),
            }),
          ),
        onSuccess: Result.succeed,
      }),
    ),
  tapLeftSync: f => syncResult => () =>
    pipe(
      syncResult,
      run,
      Result.match({
        onFailure: e => pipe(e, f, fromSync, run, () => Result.fail(e)),
        onSuccess: Result.succeed,
      }),
    ),
}

export const tap: {
  <A, E1>(
    f: (a: A) => SyncResult<unknown, E1>,
  ): <E2>(syncResult: SyncResult<A, E2>) => SyncResult<A, E1 | E2>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): <E>(syncResult: SyncResult<A, E>) => SyncResult<A, E>
} = Tappable.tapSync

export const tapResult: {
  <A, E1>(
    f: (a: A) => Result.Result<unknown, E1>,
  ): <E2>(syncResult: SyncResult<A, E2>) => SyncResult<A, E1 | E2>
} = _SyncResult.tapResult

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => SyncResult<unknown, E2>,
  ): <A>(syncResult: SyncResult<A, E1>) => SyncResult<A, E1 | E2>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => Sync<unknown>,
  ): <A>(syncResult: SyncResult<A, E>) => SyncResult<A, E>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => Result.Result<unknown, E2>,
  ): <A>(syncResult: SyncResult<A, E1>) => SyncResult<A, E1 | E2>
} = f => syncResult => () =>
  pipe(
    syncResult,
    run,
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
