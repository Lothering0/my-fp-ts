import * as Option from './option'
import * as Result from '../Result'
import { Sync } from '../Sync'
import { Monad, flatMap } from './monad'
import { map } from './functor'
import { pipe } from '../../utils/flow'
import { create } from '../../typeclasses/Tappable'
import { fromResult } from './from-result'

export const Tappable = create(Monad)

export const tap: {
  <A>(
    f: (a: A) => Option.Option<unknown>,
  ): (self: Option.Option<A>) => Option.Option<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Option.Option<A>) => Option.Option<A>
} = Tappable.tapSync

export const tapSyncOption: {
  <A>(
    f: (a: A) => Sync<Option.Option<unknown>>,
  ): (self: Option.Option<A>) => Option.Option<A>
} = afe => self =>
  pipe(
    self,
    map(afe),
    flatMap(f => f()),
    flatMap(() => self),
  )

export const tapResult: {
  <A>(
    afe: (a: A) => Result.Result<unknown, unknown>,
  ): (self: Option.Option<A>) => Option.Option<A>
} = afe => self =>
  pipe(
    self,
    map(afe),
    flatMap(fromResult),
    flatMap(() => self),
  )

export const tapSyncResult: {
  <A>(
    afe: (a: A) => Sync<Result.Result<unknown, unknown>>,
  ): (self: Option.Option<A>) => Option.Option<A>
} = afe => self =>
  pipe(
    self,
    map(afe),
    flatMap(f => fromResult(f())),
    flatMap(() => self),
  )
