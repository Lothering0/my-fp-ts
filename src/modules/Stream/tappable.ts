import * as Stream from './stream'
import * as Sync from '../Sync'
import { create } from '../../typeclasses/Tappable'
import { Monad } from './monad'

export const Tappable = create(Monad)

export const tap: {
  <A, E1, R>(
    f: (a: A) => Stream.Stream<unknown, E1, R>,
  ): <E2>(self: Stream.Stream<A, E2, R>) => Stream.Stream<A, E1 | E2, R>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync.Sync<unknown>,
  ): <E, R>(self: Stream.Stream<A, E, R>) => Stream.Stream<A, E, R>
} = Tappable.tapSync
