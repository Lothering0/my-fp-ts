import * as Option from './option'
import * as Result from '../Result'
import * as Monad from './monad'
import { Sync } from '../Sync'
import { map } from './functor'
import { pipe } from '../../utils/flow'
import { create } from '../../typeclasses/Tappable'
import { fromResult } from './from-result'

export const Tappable = create(Monad.Monad)

export const tap: {
  <A>(
    f: (a: A) => Option.Option<unknown>,
  ): (option: Option.Option<A>) => Option.Option<A>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): (option: Option.Option<A>) => Option.Option<A>
} = Tappable.tapSync

export const tapSyncOption: {
  <A>(
    f: (a: A) => Sync<Option.Option<unknown>>,
  ): (option: Option.Option<A>) => Option.Option<A>
} = afe => option =>
  pipe(
    option,
    map(afe),
    Monad.flatMap(f => f()),
    Monad.andThen(option),
  )

export const tapResult: {
  <A>(
    afe: (a: A) => Result.Result<unknown, unknown>,
  ): (option: Option.Option<A>) => Option.Option<A>
} = afe => option =>
  pipe(option, map(afe), Monad.flatMap(fromResult), Monad.andThen(option))

export const tapSyncResult: {
  <A>(
    afe: (a: A) => Sync<Result.Result<unknown, unknown>>,
  ): (option: Option.Option<A>) => Option.Option<A>
} = afe => option =>
  pipe(
    option,
    map(afe),
    Monad.flatMap(f => fromResult(f())),
    Monad.andThen(option),
  )
