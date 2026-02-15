import * as Array from '../ReadonlyArray'
import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import * as Iterable from './iterable'
import { flow } from '../../utils/flow'
import { toReadonlyArray } from './utils'

export const Foldable: Foldable_.Foldable<Iterable.Hkt> = {
  reduce: (b, bab) => iterable => {
    let out = b
    for (const a of iterable) {
      out = bab(out, a)
    }
    return out
  },
  reduceRight: (b, abb) =>
    flow(toReadonlyArray, Array.Foldable.reduceRight(b, abb)),
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  Iterable.Hkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) => iterable => {
    let out = b
    let i = -1
    for (const a of iterable) {
      i++
      out = baib(out, a, i)
    }
    return out
  },
  reduceRightWithIndex: (b, abib) =>
    flow(
      toReadonlyArray,
      Array.FoldableWithIndex.reduceRightWithIndex(b, abib),
    ),
}

export const reduce: {
  <A, B>(b: B, baib: (b: B, a: A, i: number) => B): (iterable: Iterable<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abib: (a: A, b: B, i: number) => B): (iterable: Iterable<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
