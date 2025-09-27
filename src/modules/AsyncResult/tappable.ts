import * as Result from '../Result'
import * as Async from '../Async'
import * as SyncResult from '../SyncResult'
import * as Sync from '../Sync'
import * as TappableBoth_ from '../../typeclasses/TappableBoth'
import { create } from '../../typeclasses/Tappable'
import { map } from './functor'
import {
  AsyncResult,
  AsyncResultHkt,
  fromAsync,
  toPromise,
} from './async-result'
import { pipe } from '../../utils/flow'
import { Monad, Do, apS } from './monad'

export const Tappable = create(Monad)

export const TappableBoth: TappableBoth_.TappableBoth<AsyncResultHkt> = {
  ...Tappable,
  tapLeft: f => self => () =>
    pipe(self, toPromise, promise =>
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
  tapLeftSync: f => self => () =>
    pipe(self, toPromise, promise =>
      promise.then(
        Result.match({
          onFailure: e => pipe(e, f, Sync.execute, () => Result.fail(e)),
          onSuccess: Result.succeed,
        }),
      ),
    ),
}

export const tap: {
  <Failure1, In>(
    f: (a: In) => AsyncResult<Failure1, unknown>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = Tappable.tap

export const tapSync: {
  <In>(
    f: (a: In) => Sync.Sync<unknown>,
  ): <Failure>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = Tappable.tapSync

export const tapResult: {
  <Failure1, In>(
    f: (a: In) => Result.Result<Failure1, unknown>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Async.of)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <Failure1, In>(
    f: (a: In) => SyncResult.SyncResult<Failure1, unknown>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, SyncResult.execute, Async.of)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <In>(
    f: (a: In) => Async.Async<unknown>,
  ): <Failure>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, fromAsync<never, never>)),
    map(({ a }) => a),
  )

export const tapLeft: {
  <Failure1, Failure2>(
    f: (e: Failure1) => AsyncResult<Failure2, unknown>,
  ): <In>(
    self: AsyncResult<Failure1, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <Failure>(
    f: (e: Failure) => Sync.Sync<unknown>,
  ): <In>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <Failure1, Failure2>(
    f: (e: Failure1) => Result.Result<Failure2, unknown>,
  ): <In>(
    self: AsyncResult<Failure1, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self => () =>
  pipe(self, toPromise, promise =>
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
  <Failure1, Failure2>(
    f: (e: Failure1) => SyncResult.SyncResult<Failure2, unknown>,
  ): <In>(
    self: AsyncResult<Failure1, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self => () =>
  pipe(self, toPromise, promise =>
    promise.then(
      Result.match({
        onFailure: e =>
          pipe(
            e,
            f,
            SyncResult.execute,
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
  <Failure>(
    f: (e: Failure) => Async.Async<unknown>,
  ): <In>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = f => self => () =>
  pipe(self, toPromise, promise =>
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
