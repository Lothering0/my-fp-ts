import { Sync } from '../Sync'
import { NonEmptyList } from './non-empty-list'
import { Monad } from './monad'
import { create } from '../../typeclasses/Tappable'

export const Tappable = create(Monad)

export const tap: {
  <A>(
    f: (a: A) => NonEmptyList<unknown>,
  ): (list: NonEmptyList<A>) => NonEmptyList<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (list: NonEmptyList<A>) => NonEmptyList<A>
} = Tappable.tapSync
