import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import * as Array from './readonly-array'

export const Foldable: Foldable_.Foldable<Array.Hkt> = {
  reduce: (b, bab) => array => array.reduce((b, a) => bab(b, a), b),
  reduceRight: (b, abb) => array => array.reduceRight((b, a) => abb(a, b), b),
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  Array.Hkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) => array =>
    array.reduce((b, a, i) => baib(b, a, i), b),
  reduceRightWithIndex: (b, abib) => array =>
    array.reduceRight((b, a, i) => abib(a, b, i), b),
}

export const reduce: {
  <A, B>(
    b: B,
    baib: (b: B, a: A, i: number) => B,
  ): (array: ReadonlyArray<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(
    b: B,
    abib: (a: A, b: B, i: number) => B,
  ): (array: ReadonlyArray<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
