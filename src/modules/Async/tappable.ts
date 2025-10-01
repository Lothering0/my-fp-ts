import * as Async from './async'
import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad } from './monad'

export const Tappable = create(Monad)

export const tap: {
  <A>(
    f: (a: A) => Async.Async<unknown>,
  ): (self: Async.Async<A>) => Async.Async<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Async.Async<A>) => Async.Async<A>
} = Tappable.tapSync
