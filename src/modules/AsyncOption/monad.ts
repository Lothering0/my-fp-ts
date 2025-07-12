/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Async"
import * as AR from "../AsyncResult"
import * as R from "../Result"
import * as O from "../Option"
import * as SO from "../SyncOption"
import * as SR from "../SyncResult"
import { createMonad } from "../../types/Monad"
import {
  AsyncOptionHKT,
  AsyncOption,
  fromAsyncOption,
  toAsyncOptionFromAsync,
} from "./async-option"
import { map } from "./functor"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { DoObject } from "../../types/DoObject"

export const Monad = createMonad<AsyncOptionHKT> ({
  ...Applicative,
  flat: self => () =>
    fromAsyncOption (self).then (ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, fromAsyncOption),
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
  <N extends string | number | symbol, A, B>(
    fb: AsyncOption<B>,
  ): (fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: AsyncOption<A>,
    fb: AsyncOption<B>,
  ): AsyncOption<DoObject<N, A, B>>
} = overload (
  1,
  (fa, fb) => () =>
    Promise.all ([fromAsyncOption (fa), fromAsyncOption (fb)]).then (([ma, mb]) =>
      O.flatMap (mb, () => ma as any),
    ),
)

export const parallelTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): (fa: AsyncOption<A>) => AsyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: AsyncOption<A>,
    name: Exclude<N, keyof A>,
    fb: AsyncOption<B>,
  ): AsyncOption<DoObject<N, A, B>>
} = overload (
  2,
  (fa, name, fb) => () =>
    Promise.all ([fromAsyncOption (fa), fromAsyncOption (fb)]).then (([ma, mb]) =>
      O.apS (ma, name, mb),
    ),
)

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: AsyncOption<A>) => AsyncOption<A>
  <A, _>(self: AsyncOption<A>, f: (a: A) => O.Option<_>): AsyncOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, A.of)),
    map (({ a }) => a),
  ),
)

export const tapResult: {
  <E, A, _>(
    f: (a: A) => R.Result<E, _>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
  <E, A, _>(self: AsyncOption<A>, f: (a: A) => R.Result<E, _>): AsyncOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, O.fromResult, A.of)),
    map (({ a }) => a),
  ),
)

export const tapAsync: {
  <A, _>(f: (a: A) => A.Async<_>): (self: AsyncOption<A>) => AsyncOption<A>
  <A, _>(self: AsyncOption<A>, f: (a: A) => A.Async<_>): AsyncOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, toAsyncOptionFromAsync)),
    map (({ a }) => a),
  ),
)

export const tapAsyncResult: {
  <E, A, _>(
    f: (a: A) => AR.AsyncResult<E, _>,
  ): (ma: AsyncOption<A>) => AsyncOption<A>
  <E, A, _>(
    ma: AsyncOption<A>,
    f: (a: A) => AR.AsyncResult<E, _>,
  ): AsyncOption<A>
} = overload (1, (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
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
  ),
)

export const tapSyncOption: {
  <A, _>(
    f: (a: A) => SO.SyncOption<_>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
  <A, _>(self: AsyncOption<A>, f: (a: A) => SO.SyncOption<_>): AsyncOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tapOption (({ a }) => pipe (a, f, SO.fromSyncOption)),
    map (({ a }) => a),
  ),
)

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => SR.SyncResult<E, _>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
  <E, A, _>(
    self: AsyncOption<A>,
    f: (a: A) => SR.SyncResult<E, _>,
  ): AsyncOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tapResult (({ a }) => pipe (a, f, SR.fromSyncResult)),
    map (({ a }) => a),
  ),
)
