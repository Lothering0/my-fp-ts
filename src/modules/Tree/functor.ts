import * as Iterable from '../Iterable'
import * as Functor_ from '../../typeclasses/Functor'
import { Tree, TreeHkt } from './tree'
import { make, valueOf, forestOf } from './utils'
import { pipe } from '../../utils/flow'

export const Functor = Functor_.create<TreeHkt>({
  map: ab => tree =>
    make(pipe(tree, valueOf, ab), pipe(tree, forestOf, Iterable.map(map(ab)))),
})

export const map: {
  <A, B>(ab: (a: A) => B): (tree: Tree<A>) => Tree<B>
} = Functor.map

export const as: {
  <A>(a: A): (tree: Tree<unknown>) => Tree<A>
} = Functor.as
