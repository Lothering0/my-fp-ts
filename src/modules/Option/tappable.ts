import * as Option from './option'
import * as Result from '../Result'
import { Sync } from '../Sync'
import { Monad, flatMap } from './monad'
import { map } from './functor'
import { pipe } from '../../utils/flow'
import { constant } from '../../utils/constant'
import { create } from '../../typeclasses/Tappable'

export const Tappable = create(Monad)

export const tap: {
  <A>(
    f: (a: A) => Option.Option<unknown>,
  ): (self: Option.Option<A>) => Option.Option<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Option.Option<A>) => Option.Option<A>
} = Tappable.tapSync

export const tapResult: {
  <E, A>(
    afe: (a: A) => Result.Result<E, unknown>,
  ): (self: Option.Option<A>) => Option.Option<A>
} = afe => self =>
  pipe(
    self,
    map(afe),
    flatMap(
      Result.match({
        onFailure: Option.none,
        onSuccess: constant(self),
      }),
    ),
  )
