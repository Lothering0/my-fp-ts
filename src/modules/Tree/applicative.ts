import { Tree, TreeHkt } from './tree'
import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'

export const Applicative = create<TreeHkt>(Monad)

export const apply: {
  <A>(fa: Tree<A>): <B>(self: Tree<(a: A) => B>) => Tree<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(fab: Tree<(a: A) => B>): (self: Tree<A>) => Tree<B>
} = Applicative.flipApply
