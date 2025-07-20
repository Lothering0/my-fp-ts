/* eslint-disable @typescript-eslint/no-explicit-any */
import * as R from "../Result"
import * as A from "../Async"
import * as SR from "../SyncResult"
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
import { overload } from "../../utils/overloads"
import { DoObject } from "../../types/DoObject"

export const Monad = createMonad<AsyncResultHKT> ({
  ...Applicative,
  flat: self => () =>
    toPromise (self).then (ma =>
      R.isFailure (ma) ? ma : pipe (ma, R.fromSuccess, toPromise),
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
  <_, A, B>(
    self: AsyncResult<_, A>,
    amb: (a: A) => AsyncResult<_, B>,
  ): AsyncResult<_, B>
} = Monad.flatMap

export const compose: {
  <_, A, B, C>(
    bmc: (b: B) => AsyncResult<_, C>,
    amb: (a: A) => AsyncResult<_, B>,
  ): (a: A) => AsyncResult<_, C>
  <_, A, B, C>(
    bmc: (b: B) => AsyncResult<_, C>,
    amb: (a: A) => AsyncResult<_, B>,
    a: A,
  ): AsyncResult<_, C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: AsyncResult<_, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): AsyncResult<_, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: AsyncResult<_, A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): AsyncResult<_, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fab: AsyncResult<_, (a: A) => B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: AsyncResult<_, A>,
    name: Exclude<N, keyof A>,
    fab: AsyncResult<_, (a: A) => B>,
  ): AsyncResult<_, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<_, B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: AsyncResult<_, A>,
    name: Exclude<N, keyof A>,
    fb: AsyncResult<_, B>,
  ): AsyncResult<_, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncResult<_, B>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: AsyncResult<_, A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncResult<_, B>,
  ): AsyncResult<_, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <_, A, _2>(
    am_: (a: A) => AsyncResult<_, _2>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, A>
  <_, A, _2>(
    self: AsyncResult<_, A>,
    am_: (a: A) => AsyncResult<_, _2>,
  ): AsyncResult<_, A>
} = Monad.tap

export const tapSync: {
  <_, A, _2>(
    am_: (a: A) => Sync<_2>,
  ): (self: AsyncResult<_, A>) => AsyncResult<_, A>
  <_, A, _2>(
    self: AsyncResult<_, A>,
    am_: (a: A) => Sync<_2>,
  ): AsyncResult<_, A>
} = Monad.tapSync

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
    Promise.all ([toPromise (self), toPromise (fb)]).then (([ma, mb]) =>
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
    Promise.all ([toPromise (self), toPromise (fb)]).then (([ma, mb]) =>
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
    tap (({ a }) => pipe (a, f, SR.execute, A.of)),
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
    tap (({ a }) => pipe (a, f, fromAsync)),
    map (({ a }) => a),
  ),
)
