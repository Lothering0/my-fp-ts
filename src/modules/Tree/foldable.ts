import * as Iterable from '../Iterable'
import * as Foldable_ from '../../typeclasses/Foldable'
import { Tree, TreeHkt } from './tree'
import { forestOf, valueOf } from './utils'
import { pipe } from '../../utils/flow'

export const Foldable: Foldable_.Foldable<TreeHkt> = {
  reduce: (b, bab) => tree =>
    Iterable.reduce(bab(b, valueOf(tree)), (b, tree) =>
      pipe(tree, reduce(b, bab)),
    )(forestOf(tree)),
  reduceRight: (b, abb) => tree =>
    abb(
      valueOf(tree),
      Iterable.reduceRight(b, (tree, b) => pipe(tree, reduceRight(b, abb)))(
        forestOf(tree),
      ),
    ),
}

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (tree: Tree<A>) => B
} = Foldable.reduce

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (tree: Tree<A>) => B
} = Foldable.reduceRight
