import * as async from '../Async'
import * as asyncResult from '../AsyncResult'
import * as result from '../Result'
import * as syncOption from '../SyncOption'
import * as syncResult from '../SyncResult'
import * as option from '../Option'
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
    f: (a: In) => option.Option<unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, async.of)),
    map(({ a }) => a),
  )

export const tapResult: {
  <Collectable, In>(
    f: (a: In) => result.Result<Collectable, unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) => pipe(a, f, option.fromResult, async.of)),
    map(({ a }) => a),
  )

export const tapAsync: {
  <In>(
    f: (a: In) => async.Async<unknown>,
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
    f: (a: In) => asyncResult.AsyncResult<Collectable, unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tap(({ a }) =>
      pipe(
        a,
        f,
        asyncResult.match({
          onFailure: () => option.none,
          onSuccess: () => option.some(a),
        }),
      ),
    ),
    map(({ a }) => a),
  )

export const tapSyncOption: {
  <In>(
    f: (a: In) => syncOption.SyncOption<unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tapOption(({ a }) => pipe(a, f, syncOption.execute)),
    map(({ a }) => a),
  )

export const tapSyncResult: {
  <Collectable, In>(
    f: (a: In) => syncResult.SyncResult<Collectable, unknown>,
  ): (self: AsyncOption<In>) => AsyncOption<In>
} = f => self =>
  pipe(
    Do,
    apS('a', self),
    tapResult(({ a }) => pipe(a, f, syncResult.execute)),
    map(({ a }) => a),
  )
