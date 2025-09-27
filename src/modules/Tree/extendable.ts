import * as Iterable from '../Iterable'
import { create } from '../../typeclasses/Extendable'
import { Tree, TreeHkt } from './tree'
import { Functor } from './functor'
import { forestOf, make } from './utils'

export const Extendable = create<TreeHkt>(Functor, {
  extend: fab => self =>
    make(fab(self), Iterable.map(extend(fab))(forestOf(self))),
})

export const extend: {
  <A, B>(fab: (fa: Tree<A>) => B): (self: Tree<A>) => Tree<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: Tree<A>): Tree<Tree<A>>
} = Extendable.duplicate
