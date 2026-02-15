import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad } from './monad'
import { Reader } from './reader'

export const Tappable = create(Monad)

export const tap: {
  <R, A>(
    f: (a: A) => Reader<R, unknown>,
  ): (reader: Reader<R, A>) => Reader<R, A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): <R>(reader: Reader<R, A>) => Reader<R, A>
} = Tappable.tapSync
