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
  <In>(
    f: (a: In) => AsyncOption<unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = Tappable.tap

export const tapSync: {
  <In>(f: (a: In) => Sync<unknown>): (self: AsyncOption<In>) => AsyncOption<In>
} = Tappable.tapSync

export const tapOption: {
  <In>(
    f: (a: In) => Option.Option<unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Async.of)),
    map(({ a }) => a),
  )

export const tapResult: {
  <Collectable, In>(
    f: (a: In) => Result.Result<Collectable, unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, Option.fromResult, Async.of)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <In>(
    f: (a: In) => Async.Async<unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, fromAsync)),
    map(({ a }) => a),
  )

export const tapAsyncResult: {
  <Collectable, In>(
    f: (a: In) => AsyncResult.AsyncResult<Collectable, unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) =>
      pipe(
        a,
        f,
        AsyncResult.match({
          onFailure: () => Option.none,
          onSuccess: () => Option.some(a),
        }),
      ),
    ),
    map(({ a }) => a),
  )

export const tapSyncOption: {
  <In>(
    f: (a: In) => SyncOption.SyncOption<unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tapOption(({ a }) => pipe(a, f, SyncOption.execute)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <Collectable, In>(
    f: (a: In) => SyncResult.SyncResult<Collectable, unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tapResult(({ a }) => pipe(a, f, SyncResult.execute)),
    map(({ a }) => a),
  )
