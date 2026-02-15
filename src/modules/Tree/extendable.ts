import * as Iterable from '../Iterable'
import { create } from '../../typeclasses/Extendable'
import { Tree, Hkt } from './tree'
import { Functor } from './functor'
import { forestOf, make } from './utils'

export const Extendable = create<Hkt>(Functor, {
  extend: fab => tree =>
    make(fab(tree), Iterable.map(extend(fab))(forestOf(tree))),
})

export const extend: {
  <A, B>(fab: (tree: Tree<A>) => B): (tree: Tree<A>) => Tree<B>
} = Extendable.extend

export const duplicate: {
  <A>(tree: Tree<A>): Tree<Tree<A>>
} = Extendable.duplicate
