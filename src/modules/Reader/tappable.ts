import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad } from './monad'
import { Reader } from './reader'

export const Tappable = create(Monad)

export const tap: {
  <Fixed, In>(
    f: (a: In) => Reader<Fixed, unknown>,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, In>
} = Tappable.tap

export const tapSync: {
  <In>(f: (a: In) => Sync<unknown>): <R>(self: Reader<R, In>) => Reader<R, In>
} = Tappable.tapSync
