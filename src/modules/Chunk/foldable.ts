import * as Chunk from './chunk'
import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import * as Iterable from '../Iterable'

export const Foldable: Foldable_.Foldable<Chunk.Hkt> = {
  reduce: Iterable.Foldable.reduce,
  reduceRight: Iterable.Foldable.reduceRight,
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  Chunk.Hkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: Iterable.FoldableWithIndex.reduceWithIndex,
  reduceRightWithIndex: Iterable.FoldableWithIndex.reduceRightWithIndex,
}

export const reduce: {
  <A, B>(b: B, baib: (b: B, a: A, i: number) => B): (self: Chunk.Chunk<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abib: (a: A, b: B, i: number) => B): (self: Chunk.Chunk<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
