/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result from "../Result"
import * as async from "../Async"
import * as syncResult from "../SyncResult"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import { map } from "./functor"
import { Applicative } from "./applicative"
import {
  AsyncResultHKT,
  AsyncResult,
  toPromise,
  fromAsync,
} from "./async-result"
import { pipe } from "../../utils/flow"
import { DoObject } from "../../types/DoObject"

export const Monad = createMonad<AsyncResultHKT> ({
  ...Applicative,
  flat: self => () =>
    toPromise (self).then (ma =>
      result.isFailure (ma) ? ma : pipe (ma, result.fromSuccess, toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <_, A>(self: AsyncResult<_, AsyncResult<_, A>>): AsyncResult<_, A>
} = Monad.flat

export const flatMap: {
  <_, A, B>(
    amb: (a: A) => AsyncResult<_, B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, B>
} = Monad.flatMap

export const compose: {
  <_, A, B, C>(
    bmc: (b: B) => AsyncResult<_, C>,
    amb: (a: A) => AsyncResult<_, B>,
  ): (a: A) => AsyncResult<_, C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <_>(self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <_>(self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fab: AsyncResult<_, (a: A) => B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<_, B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncResult<_, B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <_, A, _2>(
    am_: (a: A) => AsyncResult<_, _2>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, A>
} = Monad.tap

export const tapSync: {
  <A, _>(
    am_: (a: A) => Sync<_>,
  ): <_2>(self: AsyncResult<_2, A>) => AsyncResult<_2, A>
} = Monad.tapSync

export const tapResult: {
  <E, A, _>(
    f: (a: A) => result.Result<E, _>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, async.of)),
    map (({ a }) => a),
  )

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => syncResult.SyncResult<E, _>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, syncResult.execute, async.of)),
    map (({ a }) => a),
  )

export const tapAsync =
  <A, _>(f: (a: A) => async.Async<_>) =>
  <_2>(self: AsyncResult<_2, A>): AsyncResult<_2, A> =>
    pipe (
      Do,
      apS ("a", self),
      tap (({ a }) => pipe (a, f, fromAsync<_2, _>)),
      map (({ a }) => a),
    )

export const parallel: {
  <N extends string | number | symbol, E, B>(
    fb: AsyncResult<E, B>,
  ): <A>(self: AsyncResult<E, A>) => AsyncResult<E, DoObject<N, A, B>>
} = fb => self => () =>
  Promise.all ([toPromise (self), toPromise (fb)]).then (([ma, mb]) =>
    pipe (
      mb,
      result.flatMap (() => ma as any),
    ),
  )

export const parallelTo: {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<E, B>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, DoObject<N, A, B>>
} = (name, fb) => self => () =>
  Promise.all ([toPromise (self), toPromise (fb)]).then (([ma, mb]) =>
    result.apS (name, mb) (ma),
  )
