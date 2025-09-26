import * as result from '../Result'
import * as async from '../Async'
import * as syncResult from '../SyncResult'
import * as sync from '../Sync'
import * as tappableBoth from '../../typeclasses/TappableBoth'
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

export const TappableBoth: tappableBoth.TappableBoth<AsyncResultHkt> = {
  ...Tappable,
  tapLeft: f => self => () =>
    pipe(self, toPromise, promise =>
      promise.then(
        result.match({
          onFailure: e =>
            pipe(e, f, toPromise, promise =>
              promise.then(
                result.match({
                  onFailure: result.fail,
                  onSuccess: () => result.fail(e),
                }),
              ),
            ),
          onSuccess: result.succeed,
        }),
      ),
    ),
  tapLeftSync: f => self => () =>
    pipe(self, toPromise, promise =>
      promise.then(
        result.match({
          onFailure: e => pipe(e, f, sync.execute, () => result.fail(e)),
          onSuccess: result.succeed,
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
    f: (a: In) => sync.Sync<unknown>,
  ): <Failure>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = Tappable.tapSync

export const tapResult: {
  <Failure1, In>(
    f: (a: In) => result.Result<Failure1, unknown>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, async.of)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <Failure1, In>(
    f: (a: In) => syncResult.SyncResult<Failure1, unknown>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, syncResult.execute, async.of)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <In>(
    f: (a: In) => async.Async<unknown>,
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
    f: (e: Failure) => sync.Sync<unknown>,
  ): <In>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <Failure1, Failure2>(
    f: (e: Failure1) => result.Result<Failure2, unknown>,
  ): <In>(
    self: AsyncResult<Failure1, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self => () =>
  pipe(self, toPromise, promise =>
    promise.then(
      result.match({
        onFailure: e =>
          pipe(
            e,
            f,
            result.match({
              onFailure: result.fail,
              onSuccess: () => result.fail(e),
            }),
          ),
        onSuccess: result.succeed,
      }),
    ),
  )

export const tapLeftSyncResult: {
  <Failure1, Failure2>(
    f: (e: Failure1) => syncResult.SyncResult<Failure2, unknown>,
  ): <In>(
    self: AsyncResult<Failure1, In>,
  ) => AsyncResult<Failure1 | Failure2, In>
} = f => self => () =>
  pipe(self, toPromise, promise =>
    promise.then(
      result.match({
        onFailure: e =>
          pipe(
            e,
            f,
            syncResult.execute,
            result.match({
              onFailure: result.fail,
              onSuccess: () => result.fail(e),
            }),
          ),
        onSuccess: result.succeed,
      }),
    ),
  )

export const tapLeftAsync: {
  <Failure>(
    f: (e: Failure) => async.Async<unknown>,
  ): <In>(self: AsyncResult<Failure, In>) => AsyncResult<Failure, In>
} = f => self => () =>
  pipe(self, toPromise, promise =>
    promise.then(
      result.match({
        onFailure: e =>
          pipe(e, f, async.toPromise, promise =>
            promise.then(() => result.fail(e)),
          ),
        onSuccess: result.succeed,
      }),
    ),
  )
