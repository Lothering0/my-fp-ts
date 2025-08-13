import * as result from "../Result"
import * as async from "../Async"
import * as syncResult from "../SyncResult"
import { createTappable } from "../../types/Tappable"
import { Sync } from "../Sync"
import { map } from "./functor"
import { AsyncResult, fromAsync } from "./async-result"
import { pipe } from "../../utils/flow"
import { Monad, Do, apS } from "./monad"

const Tap = createTappable (Monad)

export const tap: {
  <E1, A>(
    f: (a: A) => AsyncResult<E1, unknown>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, A>
} = Tap.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): <E>(self: AsyncResult<E, A>) => AsyncResult<E, A>
} = Tap.tapSync

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

export const tapAsync =
  <A>(f: (a: A) => async.Async<unknown>) =>
  <E>(self: AsyncResult<E, A>): AsyncResult<E, A> =>
    pipe (
      Do,
      apS ("a", self),
      tap (({ a }) => pipe (a, f, fromAsync<E, unknown>)),
      map (({ a }) => a),
    )
