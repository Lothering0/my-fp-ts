import * as Iterable from '../Iterable'
import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import { List, Hkt } from './list'

export const Foldable: Foldable_.Foldable<Hkt> = {
  reduce: (b, bab) => Iterable.Foldable.reduce(b, bab),
  reduceRight: (b, abb) => Iterable.Foldable.reduceRight(b, abb),
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  Hkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) =>
    Iterable.FoldableWithIndex.reduceWithIndex(b, baib),
  reduceRightWithIndex: (b, abib) =>
    Iterable.FoldableWithIndex.reduceRightWithIndex(b, abib),
}

export const reduce: {
  <A, B>(b: B, baib: (b: B, a: A, i: number) => B): (list: List<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abib: (a: A, b: B, i: number) => B): (list: List<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
