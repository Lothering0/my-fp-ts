import { Tree, TreeHkt } from './tree'
import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'

export const Applicative = create<TreeHkt>(Monad)

export const apply: {
  <A>(tree: Tree<A>): <B>(selfTree: Tree<(a: A) => B>) => Tree<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(tree: Tree<(a: A) => B>): (selfTree: Tree<A>) => Tree<B>
} = Applicative.flipApply
