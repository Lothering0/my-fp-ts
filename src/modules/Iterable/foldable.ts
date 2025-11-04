import * as Array from '../ReadonlyArray'
import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import { IterableHkt } from './iterable'
import { flow } from '../../utils/flow'
import { toReadonlyArray } from './utils'

export const Foldable: Foldable_.Foldable<IterableHkt> = {
  reduce: (b, bab) => flow(toReadonlyArray, Array.Foldable.reduce(b, bab)),
  reduceRight: (b, abb) =>
    flow(toReadonlyArray, Array.Foldable.reduceRight(b, abb)),
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  IterableHkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) =>
    flow(toReadonlyArray, Array.FoldableWithIndex.reduceWithIndex(b, baib)),
  reduceRightWithIndex: (b, abib) =>
    flow(
      toReadonlyArray,
      Array.FoldableWithIndex.reduceRightWithIndex(b, abib),
    ),
}

export const reduce: {
  <A, B>(b: B, baib: (b: B, a: A, i: number) => B): (self: Iterable<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abib: (a: A, b: B, i: number) => B): (self: Iterable<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
