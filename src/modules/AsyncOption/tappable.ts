import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as Result from '../Result'
import * as SyncOption from '../SyncOption'
import * as SyncResult from '../SyncResult'
import * as Option from '../Option'
import { create } from '../../typeclasses/Tappable'
import { Do, Monad, apS } from './monad'
import { AsyncOption, fromAsync } from './async-option'
import { Sync } from '../Sync'
import { map } from './functor'
import { pipe } from '../../utils/flow'

export const Tappable = create(Monad)

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
    f: (a: A) => Option.Option<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Async.of)),
    map(({ a }) => a),
  )

export const tapResult: {
  <A>(
    f: (a: A) => Result.Result<unknown, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Option.fromResult, Async.of)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <A>(
    f: (a: A) => Async.Async<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, fromAsync)),
    map(({ a }) => a),
  )

export const tapAsyncResult: {
  <A>(
    f: (a: A) => AsyncResult.AsyncResult<unknown, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) =>
      pipe(
        a,
        f,
        AsyncResult.match({
          onFailure: () => Option.none(),
          onSuccess: () => Option.some(a),
        }),
      ),
    ),
    map(({ a }) => a),
  )

export const tapSyncOption: {
  <A>(
    f: (a: A) => SyncOption.SyncOption<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tapOption(({ a }) => pipe(a, f, SyncOption.execute)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <A>(
    f: (a: A) => SyncResult.SyncResult<unknown, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tapResult(({ a }) => pipe(a, f, SyncResult.execute)),
    map(({ a }) => a),
  )
