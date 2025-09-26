import { Monad } from './monad'
import { Sync } from '../Sync'
import { Tree } from './tree'
import { create } from '../../typeclasses/Tappable'

export const Tappable = create(Monad)

export const tap: {
  <A>(f: (a: A) => Tree<unknown>): (self: Tree<A>) => Tree<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Tree<A>) => Tree<A>
} = Tappable.tapSync
