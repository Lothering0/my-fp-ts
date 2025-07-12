/* eslint-disable @typescript-eslint/no-explicit-any */
import * as R from "../Result"
import * as A from "../Async"
import * as SR from "../SyncResult"
import { createMonad } from "../../types/Monad"
import { map } from "./functor"
import { applicative } from "./applicative"
import {
  AsyncResultHKT,
  AsyncResult,
  fromAsyncResult,
  toAsyncResult,
} from "./async-result"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { DoObject } from "src/types/DoObject"

export const Monad = createMonad<AsyncResultHKT> ({
  ...applicative,
  flat: self => () =>
    fromAsyncResult (self).then (ma =>
      R.isFailure (ma) ? ma : pipe (ma, R.fromSuccess, fromAsyncResult),
    ),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapSync,
} = Monad

export const parallel: {
  <N extends string | number | symbol, E, A, B>(
    fb: AsyncResult<E, B>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, DoObject<N, A, B>>
  <N extends string | number | symbol, E, A, B>(
    self: AsyncResult<E, A>,
    fb: AsyncResult<E, B>,
  ): AsyncResult<E, DoObject<N, A, B>>
} = overload (
  1,
  (self, fb) => () =>
    Promise.all ([fromAsyncResult (self), fromAsyncResult (fb)]).then (([ma, mb]) =>
      R.flatMap (mb, () => ma as any),
    ),
)

export const parallelTo: {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<E, B>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, DoObject<N, A, B>>
  <N extends string | number | symbol, E, A, B>(
    self: AsyncResult<E, A>,
    name: Exclude<N, keyof A>,
    fb: AsyncResult<E, B>,
  ): AsyncResult<E, DoObject<N, A, B>>
} = overload (
  2,
  (self, name, fb) => () =>
    Promise.all ([fromAsyncResult (self), fromAsyncResult (fb)]).then (([ma, mb]) =>
      R.apS (ma, name, mb),
    ),
)

export const tapResult: {
  <E, A, _>(
    f: (a: A) => R.Result<E, _>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, A>
  <E, A, _>(
    self: AsyncResult<E, A>,
    f: (a: A) => R.Result<E, _>,
  ): AsyncResult<E, A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, A.of)),
    map (({ a }) => a),
  ),
)

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => SR.SyncResult<E, _>,
  ): (self: AsyncResult<E, A>) => AsyncResult<E, A>
  <E, A, _>(
    self: AsyncResult<E, A>,
    f: (a: A) => SR.SyncResult<E, _>,
  ): AsyncResult<E, A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, SR.fromSyncResult, A.of)),
    map (({ a }) => a),
  ),
)

export const tapAsync: {
  <_, A, _2>(
    f: (a: A) => A.Async<_2>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, A>
  <_, A, _2>(
    self: AsyncResult<_, A>,
    f: (a: A) => A.Async<_2>,
  ): AsyncResult<_, A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, toAsyncResult)),
    map (({ a }) => a),
  ),
)
