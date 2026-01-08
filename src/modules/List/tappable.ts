import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { List } from './list'
import { Monad } from './monad'

export const Tappable = create(Monad)

export const tap: {
  <A>(f: (a: A) => List<unknown>): (list: List<A>) => List<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (list: List<A>) => List<A>
} = Tappable.tapSync
