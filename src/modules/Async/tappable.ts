import * as Async from './async'
import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad } from './monad'

export const Tappable = create(Monad)

export const tap: {
  <In>(
    f: (a: In) => Async.Async<unknown>,
  ): (self: Async.Async<In>) => Async.Async<In>
} = Tappable.tap

export const tapSync: {
  <In>(f: (a: In) => Sync<unknown>): (self: Async.Async<In>) => Async.Async<In>
} = Tappable.tapSync
