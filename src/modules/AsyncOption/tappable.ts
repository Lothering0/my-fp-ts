import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as Result from '../Result'
import * as SyncOption from '../SyncOption'
import * as SyncResult from '../SyncResult'
import * as Option from '../Option'
import { Tappable as Tappable_ } from '../../typeclasses/Tappable'
import { Do, bind } from './monad'
import { AsyncOption, AsyncOptionHkt, fromAsync } from './async-option'
import { Sync } from '../Sync'
import { map } from './functor'
import { pipe } from '../../utils/flow'
import { _AsyncOption } from './_internal'

export const Tappable: Tappable_<AsyncOptionHkt> = _AsyncOption.Tappable

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
} = _AsyncOption.tapOption

export const tapResult: {
  <A>(
    f: (a: A) => Result.Result<unknown, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = _AsyncOption.tapResult

export const tapAsync: {
  <A>(
    f: (a: A) => Async.Async<unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = f => self =>
  pipe(
    Do,
    bind('a', self),
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
    bind('a', self),
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
} = _AsyncOption.tapSyncOption

export const tapSyncResult: {
  <A>(
    f: (a: A) => SyncResult.SyncResult<unknown, unknown>,
  ): (self: AsyncOption<A>) => AsyncOption<A>
} = _AsyncOption.tapSyncResult
