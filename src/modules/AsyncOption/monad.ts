/* eslint-disable @typescript-eslint/no-explicit-any */
import * as async from "../Async"
import * as asyncResult from "../AsyncResult"
import * as result from "../Result"
import * as option from "../Option"
import * as syncOption from "../SyncOption"
import * as syncResult from "../SyncResult"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import {
  AsyncOptionHkt,
  AsyncOption,
  toPromise,
  fromAsync,
} from "./async-option"
import { map } from "./functor"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { DoObject, DoObjectKey } from "../../types/DoObject"

export const Monad = createMonad<AsyncOptionHkt> ({
  ...Applicative,
  flat: self => () =>
    toPromise (self).then (ma =>
      option.isNone (ma) ? ma : pipe (ma, option.value, toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: AsyncOption<AsyncOption<A>>): AsyncOption<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => AsyncOption<C>,
    amb: (a: A) => AsyncOption<B>,
  ): (a: A) => AsyncOption<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A>(
    f: (a: A) => AsyncOption<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = Monad.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: AsyncOption<A>) => AsyncOption<A>
} = Monad.tapSync

export const tapOption: {
  <A>(
    f: (a: A) => option.Option<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, async.of)),
    map (({ a }) => a),
  )

export const tapResult: {
  <E, A>(
    f: (a: A) => result.Result<E, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, option.fromResult, async.of)),
    map (({ a }) => a),
  )

export const tapAsync: {
  <A>(
    f: (a: A) => async.Async<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, fromAsync)),
    map (({ a }) => a),
  )

export const tapAsyncResult: {
  <E, A>(
    f: (a: A) => asyncResult.AsyncResult<E, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) =>
      pipe (
        a,
        f,
        asyncResult.match (
          () => option.none,
          () => option.some (a),
        ),
      ),
    ),
    map (({ a }) => a),
  )

export const tapSyncOption: {
  <A>(
    f: (a: A) => syncOption.SyncOption<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tapOption (({ a }) => pipe (a, f, syncOption.execute)),
    map (({ a }) => a),
  )

export const tapSyncResult: {
  <E, A>(
    f: (a: A) => syncResult.SyncResult<E, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tapResult (({ a }) => pipe (a, f, syncResult.execute)),
    map (({ a }) => a),
  )

export const parallel: {
  <N extends DoObjectKey, B>(
    fb: AsyncOption<B>,
  ): <A>(fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = fb => fa => () =>
  Promise.all ([toPromise (fa), toPromise (fb)]).then (([ma, mb]) =>
    pipe (
      mb,
      option.flatMap (() => ma as any),
    ),
  )

export const parallelTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = (name, fb) => fa => () =>
  Promise.all ([toPromise (fa), toPromise (fb)]).then (([ma, mb]) =>
    option.apS (name, mb) (ma),
  )
