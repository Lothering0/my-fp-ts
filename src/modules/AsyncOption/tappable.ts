import * as async from "../Async"
import * as asyncResult from "../AsyncResult"
import * as result from "../Result"
import * as syncOption from "../SyncOption"
import * as syncResult from "../SyncResult"
import * as option from "../Option"
import { createTappable } from "../../typeclasses/Tappable"
import { Do, Monad, apS } from "./monad"
import { AsyncOption, fromAsync } from "./async-option"
import { Sync } from "../Sync"
import { map } from "./functor"
import { pipe } from "../../utils/flow"

export const Tappable = createTappable (Monad)

export const tap: {
  <A>(
    f: (a: A) => AsyncOption<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: AsyncOption<A>) => AsyncOption<A>
} = Tappable.tapSync

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
