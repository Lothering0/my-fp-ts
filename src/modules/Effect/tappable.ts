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
import { Monad, Do, apS } from './monad'
import { fromResult } from './from-result'
import { match } from './matchers'
import { swap } from './utils'
import { identity } from '../Identity'

export const Tappable = create(Monad)

export const TappableBoth: TappableBoth_.TappableBoth<Effect.EffectHkt> = {
  ...Tappable,
  tapLeft: f =>
    mapResult(ma => {
      if (Result.isSuccess(ma)) {
        return ma
      }
      return pipe(
        ma,
        Result.failureOf,
        f,
        match({
          onSuccess: () => Result.failureOf(ma),
          onFailure: e => e,
        }),
        swap,
        effect => effect.effect(),
      )
    }),
  tapLeftSync: f =>
    mapResult(ma => {
      if (Result.isSuccess(ma)) {
        return ma
      }
      pipe(ma, Result.failureOf, f, Sync.execute)
      return ma
    }),
}

export const tap: {
  <A, E1>(
    f: (a: A) => Effect.Effect<unknown, E1>,
  ): <E2>(self: Effect.Effect<A, E2>) => Effect.Effect<A, E1 | E2>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync.Sync<unknown>,
  ): <E>(self: Effect.Effect<A, E>) => Effect.Effect<A, E>
} = Tappable.tapSync

export const tapResult: {
  <A, E1>(
    f: (a: A) => Result.Result<unknown, E1>,
  ): <E2>(self: Effect.Effect<A, E2>) => Effect.Effect<A, E1 | E2>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, fromResult)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <A, E1>(
    f: (a: A) => SyncResult.SyncResult<unknown, E1>,
  ): <E2>(self: Effect.Effect<A, E2>) => Effect.Effect<A, E1 | E2>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Effect.fromSyncResult)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <A>(
    f: (a: A) => Async.Async<unknown>,
  ): <E>(self: Effect.Effect<A, E>) => Effect.Effect<A, E>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Effect.fromAsync)),
    map(({ a }) => a),
  )

export const tapAsyncResult: {
  <A, E1>(
    f: (a: A) => AsyncResult.AsyncResult<unknown, E1>,
  ): <E2>(self: Effect.Effect<A, E2>) => Effect.Effect<A, E1 | E2>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Effect.fromAsyncResult)),
    map(({ a }) => a),
  )

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => Effect.Effect<unknown, E2>,
  ): <A>(self: Effect.Effect<A, E1>) => Effect.Effect<A, E1 | E2>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(
    f: (e: E) => Sync.Sync<unknown>,
  ): <A>(self: Effect.Effect<A, E>) => Effect.Effect<A, E>
} = TappableBoth.tapLeftSync

export const tapLeftResult: {
  <E1, E2>(
    f: (e: E1) => Result.Result<unknown, E2>,
  ): <A>(self: Effect.Effect<A, E1>) => Effect.Effect<A, E1 | E2>
} = f =>
  mapResult(ma => {
    if (Result.isSuccess(ma)) {
      return ma
    }
    return pipe(
      ma,
      Result.failureOf,
      f,
      Result.match({
        onSuccess: () => Result.failureOf(ma),
        onFailure: identity,
      }),
      Result.fail,
    )
  })

export const tapLeftSyncResult: {
  <E1, E2>(
    f: (e: E1) => SyncResult.SyncResult<unknown, E2>,
  ): <A>(self: Effect.Effect<A, E1>) => Effect.Effect<A, E1 | E2>
} = f =>
  mapResult(ma => {
    if (Result.isSuccess(ma)) {
      return ma
    }
    return pipe(
      ma,
      Result.failureOf,
      f,
      SyncResult.execute,
      Result.match({
        onSuccess: () => Result.failureOf(ma),
        onFailure: identity,
      }),
      Result.fail,
    )
  })

export const tapLeftAsync: {
  <E>(
    f: (e: E) => Async.Async<unknown>,
  ): <A>(self: Effect.Effect<A, E>) => Effect.Effect<A, E>
} = f =>
  mapResult(async ma => {
    if (Result.isSuccess(ma)) {
      return ma
    }
    await pipe(ma, Result.failureOf, f, Async.toPromise)
    return ma
  })

export const tapLeftAsyncResult: {
  <E1, E2>(
    f: (e: E1) => AsyncResult.AsyncResult<unknown, E2>,
  ): <A>(self: Effect.Effect<A, E1>) => Effect.Effect<A, E1 | E2>
} = f =>
  mapResult(async ma => {
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
