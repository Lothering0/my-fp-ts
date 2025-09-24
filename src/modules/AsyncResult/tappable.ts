import * as result from "../Result"
import * as async from "../Async"
import * as syncResult from "../SyncResult"
import * as sync from "../Sync"
import * as tappableBoth from "../../typeclasses/TappableBoth"
import { create } from "../../typeclasses/Tappable"
import { map } from "./functor"
import {
  AsyncResult,
  AsyncResultHkt,
  fromAsync,
  toPromise,
} from "./async-result"
import { pipe } from "../../utils/flow"
import { Monad, Do, apS } from "./monad"

export const Tappable = create (Monad)

export const TappableBoth: tappableBoth.TappableBoth<AsyncResultHkt> = {
  ...Tappable,
  tapLeft: f => self => () =>
    pipe (self, toPromise, promise =>
      promise.then (
        result.match ({
          onFailure: e =>
            pipe (e, f, toPromise, promise =>
              promise.then (
                result.match ({
                  onFailure: result.fail,
                  onSuccess: () => result.fail (e),
                }),
              ),
            ),
          onSuccess: result.succeed,
        }),
      ),
    ),
  tapLeftSync: f => self => () =>
    pipe (self, toPromise, promise =>
      promise.then (
        result.match ({
          onFailure: e => pipe (e, f, sync.execute, () => result.fail (e)),
          onSuccess: result.succeed,
        }),
      ),
    ),
}

export const tap: {
  <E1, A>(
    f: (a: A) => AsyncResult<E1, unknown>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, A>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => sync.Sync<unknown>,
  ): <E>(self: AsyncResult<E, A>) => AsyncResult<E, A>
} = Tappable.tapSync

export const tapResult: {
  <E1, A>(
    f: (a: A) => result.Result<E1, unknown>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, async.of)),
    map (({ a }) => a),
  )

export const tapSyncResult: {
  <E1, A>(
    f: (a: A) => syncResult.SyncResult<E1, unknown>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, syncResult.execute, async.of)),
    map (({ a }) => a),
  )

export const tapAsync: {
  <A>(
    f: (a: A) => async.Async<unknown>,
  ): <E>(self: AsyncResult<E, A>) => AsyncResult<E, A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, fromAsync<never, never>)),
    map (({ a }) => a),
  )

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => AsyncResult<E2, unknown>,
  ): <A>(self: AsyncResult<E1, A>) => AsyncResult<E1 | E2, A>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => sync.Sync<unknown>,
  ): <A>(self: AsyncResult<E, A>) => AsyncResult<E, A>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => result.Result<E2, unknown>,
  ): <A>(self: AsyncResult<E1, A>) => AsyncResult<E1 | E2, A>
} = f => self => () =>
  pipe (self, toPromise, promise =>
    promise.then (
      result.match ({
        onFailure: e =>
          pipe (
            e,
            f,
            result.match ({
              onFailure: result.fail,
              onSuccess: () => result.fail (e),
            }),
          ),
        onSuccess: result.succeed,
      }),
    ),
  )

export const tapLeftSyncResult: {
  <E1, E2>(
    f: (e: E1) => syncResult.SyncResult<E2, unknown>,
  ): <A>(self: AsyncResult<E1, A>) => AsyncResult<E1 | E2, A>
} = f => self => () =>
  pipe (self, toPromise, promise =>
    promise.then (
      result.match ({
        onFailure: e =>
          pipe (
            e,
            f,
            syncResult.execute,
            result.match ({
              onFailure: result.fail,
              onSuccess: () => result.fail (e),
            }),
          ),
        onSuccess: result.succeed,
      }),
    ),
  )

export const tapLeftAsync: {
  <E>(
    f: (e: E) => async.Async<unknown>,
  ): <A>(self: AsyncResult<E, A>) => AsyncResult<E, A>
} = f => self => () =>
  pipe (self, toPromise, promise =>
    promise.then (
      result.match ({
        onFailure: e =>
          pipe (e, f, async.toPromise, promise =>
            promise.then (() => result.fail (e)),
          ),
        onSuccess: result.succeed,
      }),
    ),
  )
