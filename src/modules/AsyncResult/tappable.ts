import * as Result from '../Result'
import * as Async from '../Async'
import * as SyncResult from '../SyncResult'
import * as Sync from '../Sync'
import * as TappableBoth_ from '../../typeclasses/TappableBoth'
import { Tappable as Tappable_ } from '../../typeclasses/Tappable'
import { map } from './functor'
import {
  AsyncResult,
  AsyncResultHkt,
  fromAsync,
  toPromise,
} from './async-result'
import { pipe } from '../../utils/flow'
import { Do, bind } from './monad'
import { _AsyncResult } from './_internal'

export const Tappable: Tappable_<AsyncResultHkt> = _AsyncResult.Tappable

export const TappableBoth: TappableBoth_.TappableBoth<AsyncResultHkt> = {
  ...Tappable,
  tapLeft: f => asyncResult => () =>
    pipe(asyncResult, toPromise, promise =>
      promise.then(
        Result.match({
          onFailure: e =>
            pipe(e, f, toPromise, promise =>
              promise.then(
                Result.match({
                  onFailure: Result.fail,
                  onSuccess: () => Result.fail(e),
                }),
              ),
            ),
          onSuccess: Result.succeed,
        }),
      ),
    ),
  tapLeftSync: f => asyncResult => () =>
    pipe(asyncResult, toPromise, promise =>
      promise.then(
        Result.match({
          onFailure: e => pipe(e, f, Sync.run, () => Result.fail(e)),
          onSuccess: Result.succeed,
        }),
      ),
    ),
}

export const tap: {
  <A, E1>(
    f: (a: A) => AsyncResult<unknown, E1>,
  ): <E2>(asyncResult: AsyncResult<A, E2>) => AsyncResult<A, E1 | E2>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync.Sync<unknown>,
  ): <E>(asyncResult: AsyncResult<A, E>) => AsyncResult<A, E>
} = Tappable.tapSync

export const tapResult: {
  <A, E1>(
    f: (a: A) => Result.Result<unknown, E1>,
  ): <E2>(asyncResult: AsyncResult<A, E2>) => AsyncResult<A, E1 | E2>
} = _AsyncResult.tapResult

export const tapSyncResult: {
  <A, E1>(
    f: (a: A) => SyncResult.SyncResult<unknown, E1>,
  ): <E2>(asyncResult: AsyncResult<A, E2>) => AsyncResult<A, E1 | E2>
} = _AsyncResult.tapSyncResult

export const tapAsync: {
  <A>(
    f: (a: A) => Async.Async<unknown>,
  ): <E>(asyncResult: AsyncResult<A, E>) => AsyncResult<A, E>
} = f => asyncResult =>
  pipe(
    Do,
    bind('a', asyncResult),
    tap(({ a }) => pipe(a, f, fromAsync<never, never>)),
    map(({ a }) => a),
  )

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => AsyncResult<unknown, E2>,
  ): <A>(asyncResult: AsyncResult<A, E1>) => AsyncResult<A, E1 | E2>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => Sync.Sync<unknown>,
  ): <A>(asyncResult: AsyncResult<A, E>) => AsyncResult<A, E>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => Result.Result<unknown, E2>,
  ): <A>(asyncResult: AsyncResult<A, E1>) => AsyncResult<A, E1 | E2>
} = f => asyncResult => () =>
  pipe(asyncResult, toPromise, promise =>
    promise.then(
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
    ),
  )

export const tapLeftSyncResult: {
  <E1, E2>(
    f: (e: E1) => SyncResult.SyncResult<unknown, E2>,
  ): <A>(asyncResult: AsyncResult<A, E1>) => AsyncResult<A, E1 | E2>
} = f => asyncResult => () =>
  pipe(asyncResult, toPromise, promise =>
    promise.then(
      Result.match({
        onFailure: e =>
          pipe(
            e,
            f,
            SyncResult.run,
            Result.match({
              onFailure: Result.fail,
              onSuccess: () => Result.fail(e),
            }),
          ),
        onSuccess: Result.succeed,
      }),
    ),
  )

export const tapLeftAsync: {
  <E>(
    f: (e: E) => Async.Async<unknown>,
  ): <A>(asyncResult: AsyncResult<A, E>) => AsyncResult<A, E>
} = f => asyncResult => () =>
  pipe(asyncResult, toPromise, promise =>
    promise.then(
      Result.match({
        onFailure: e =>
          pipe(e, f, Async.toPromise, promise =>
            promise.then(() => Result.fail(e)),
          ),
        onSuccess: Result.succeed,
      }),
    ),
  )
