import * as Iterable from '../Iterable'
import * as Foldable_ from '../../typeclasses/Foldable'
import { Tree, TreeHkt } from './tree'
import { forestOf, valueOf } from './utils'
import { pipe } from '../../utils/flow'

export const Foldable: Foldable_.Foldable<TreeHkt> = {
  reduce: (b, bab) => self =>
    Iterable.reduce(bab(b, valueOf(self)), (b, tree) =>
      pipe(tree, reduce(b, bab)),
    )(forestOf(self)),
  reduceRight: (b, abb) => self =>
    abb(
      valueOf(self),
      Iterable.reduceRight(b, (tree, b) => pipe(tree, reduceRight(b, abb)))(
        forestOf(self),
      ),
    ),
}

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: Tree<A>) => B
} = Foldable.reduce

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: Tree<A>) => B
} = Foldable.reduceRight
