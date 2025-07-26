/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Async"
import * as AR from "../AsyncResult"
import * as R from "../Result"
import * as O from "../Option"
import * as SO from "../SyncOption"
import * as SR from "../SyncResult"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import {
  AsyncOptionHKT,
  AsyncOption,
  toPromise,
  fromAsync,
} from "./async-option"
import { map } from "./functor"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { DoObject } from "../../types/DoObject"

export const Monad = createMonad<AsyncOptionHKT> ({
  ...Applicative,
  flat: self => () =>
    toPromise (self).then (ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, toPromise),
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
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(
    am_: (a: A) => AsyncOption<_>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: AsyncOption<A>) => AsyncOption<A>
} = Monad.tapSync

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, A.of)),
    map (({ a }) => a),
  )

export const tapResult: {
  <E, A, _>(
    f: (a: A) => R.Result<E, _>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, O.fromResult, A.of)),
    map (({ a }) => a),
  )

export const tapAsync: {
  <A, _>(f: (a: A) => A.Async<_>): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, fromAsync)),
    map (({ a }) => a),
  )

export const tapAsyncResult: {
  <E, A, _>(
    f: (a: A) => AR.AsyncResult<E, _>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) =>
      pipe (
        a,
        f,
        AR.match (
          () => O.none,
          () => O.some (a),
        ),
      ),
    ),
    map (({ a }) => a),
  )

export const tapSyncOption: {
  <A, _>(
    f: (a: A) => SO.SyncOption<_>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tapOption (({ a }) => pipe (a, f, SO.execute)),
    map (({ a }) => a),
  )

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => SR.SyncResult<E, _>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe (
    Do,
    apS ("a", self),
    tapResult (({ a }) => pipe (a, f, SR.execute)),
    map (({ a }) => a),
  )

export const parallel: {
  <N extends string | number | symbol, B>(
    fb: AsyncOption<B>,
  ): <A>(fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = fb => fa => () =>
  Promise.all ([toPromise (fa), toPromise (fb)]).then (([ma, mb]) =>
    pipe (
      mb,
      O.flatMap (() => ma as any),
    ),
  )

export const parallelTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
} = (name, fb) => fa => () =>
  Promise.all ([toPromise (fa), toPromise (fb)]).then (([ma, mb]) =>
    O.apS (name, mb) (ma),
  )
