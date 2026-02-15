import * as Result from '../Result'
import * as AsyncResult from '../AsyncResult'
import * as Async from '../Async'
import * as SyncResult from '../SyncResult'
import * as Sync from '../Sync'
import * as TappableBoth_ from '../../typeclasses/TappableBoth'
import * as Effect from './effect'
import { create } from '../../typeclasses/Tappable'
import { map, mapResult } from './functor'
import { pipe } from '../../utils/flow'
import { Monad, Do, bind } from './monad'
import { fromResult } from './from-result'
import { match } from './matchers'
import { swap } from './utils'
import { identity } from '../Identity'

export const Tappable = create(Monad)

export const TappableBoth: TappableBoth_.TappableBoth<Effect.Hkt> = {
  ...Tappable,
  tapLeft: f =>
    mapResult(result => r => {
      if (Result.isSuccess(result)) {
        return result
      }
      return pipe(
        result,
        Result.failureOf,
        f,
        match({
          onSuccess: () => Result.failureOf(result),
          onFailure: e => e,
        }),
        swap,
        Effect.run(r),
      )
    }),
  tapLeftSync: f =>
    mapResult(result => () => {
      if (Result.isSuccess(result)) {
        return result
      }
      pipe(result, Result.failureOf, f, Sync.run)
      return result
    }),
}

export const tap: {
  <A, E1, R>(
    f: (a: A) => Effect.Effect<unknown, E1, R>,
  ): <E2>(effect: Effect.Effect<A, E2, R>) => Effect.Effect<A, E1 | E2, R>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync.Sync<unknown>,
  ): <E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
} = Tappable.tapSync

export const tapResult: {
  <A, E1>(
    f: (a: A) => Result.Result<unknown, E1>,
  ): <E2, R>(effect: Effect.Effect<A, E2, R>) => Effect.Effect<A, E1 | E2, R>
} = f => effect =>
  pipe(
    Do,
    bind('a', effect),
    tap(({ a }) => pipe(a, f, fromResult)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <A, E1>(
    f: (a: A) => SyncResult.SyncResult<unknown, E1>,
  ): <E2, R>(effect: Effect.Effect<A, E2, R>) => Effect.Effect<A, E1 | E2, R>
} = f => effect =>
  pipe(
    Do,
    bind('a', effect),
    tap(({ a }) => pipe(a, f, Effect.fromSyncResult)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <A>(
    f: (a: A) => Async.Async<unknown>,
  ): <E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
} = f => effect =>
  pipe(
    Do,
    bind('a', effect),
    tap(({ a }) => pipe(a, f, Effect.fromAsync)),
    map(({ a }) => a),
  )

export const tapAsyncResult: {
  <A, E1>(
    f: (a: A) => AsyncResult.AsyncResult<unknown, E1>,
  ): <E2, R>(effect: Effect.Effect<A, E2, R>) => Effect.Effect<A, E1 | E2, R>
} = f => effect =>
  pipe(
    Do,
    bind('a', effect),
    tap(({ a }) => pipe(a, f, Effect.fromAsyncResult)),
    map(({ a }) => a),
  )

export const tapLeft: {
  <E1, E2, R>(
    f: (e: E1) => Effect.Effect<unknown, E2, R>,
  ): <A>(effect: Effect.Effect<A, E1, R>) => Effect.Effect<A, E1 | E2, R>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => Sync.Sync<unknown>,
  ): <A, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => Result.Result<unknown, E2>,
  ): <A, R>(effect: Effect.Effect<A, E1, R>) => Effect.Effect<A, E1 | E2, R>
} = f =>
  mapResult(result => () => {
    if (Result.isSuccess(result)) {
      return result
    }
    return pipe(
      result,
      Result.failureOf,
      f,
      Result.match({
        onSuccess: () => Result.failureOf(result),
        onFailure: identity,
      }),
      Result.fail,
    )
  })

export const tapLeftSyncResult: {
  <E1, E2>(
    f: (e: E1) => SyncResult.SyncResult<unknown, E2>,
  ): <A, R>(effect: Effect.Effect<A, E1, R>) => Effect.Effect<A, E1 | E2, R>
} = f =>
  mapResult(result => () => {
    if (Result.isSuccess(result)) {
      return result
    }
    return pipe(
      result,
      Result.failureOf,
      f,
      SyncResult.run,
      Result.match({
        onSuccess: () => Result.failureOf(result),
        onFailure: identity,
      }),
      Result.fail,
    )
  })

export const tapLeftAsync: {
  <E>(
    f: (e: E) => Async.Async<unknown>,
  ): <A, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
} = f =>
  mapResult(result => async () => {
    if (Result.isSuccess(result)) {
      return result
    }
    await pipe(result, Result.failureOf, f, Async.toPromise)
    return result
  })

export const tapLeftAsyncResult: {
  <E1, E2>(
    f: (e: E1) => AsyncResult.AsyncResult<unknown, E2>,
  ): <A, R>(effect: Effect.Effect<A, E1, R>) => Effect.Effect<A, E1 | E2, R>
} = f =>
  mapResult(ma => async () => {
    if (Result.isSuccess(ma)) {
      return ma
    }
    const result = await pipe(ma, Result.failureOf, f, AsyncResult.toPromise)
    return pipe(
      result,
      Result.match({
        onSuccess: () => Result.failureOf(ma),
        onFailure: identity,
      }),
      Result.fail,
    )
  })
