import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import * as Array from './readonly-array'

export const Foldable: Foldable_.Foldable<Array.Hkt> = {
  reduce: (b, bab) => self => self.reduce((b, a) => bab(b, a), b),
  reduceRight: (b, abb) => self => self.reduceRight((b, a) => abb(a, b), b),
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  Array.Hkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) => self =>
    self.reduce((b, a, i) => baib(b, a, i), b),
  reduceRightWithIndex: (b, abib) => self =>
    self.reduceRight((b, a, i) => abib(a, b, i), b),
}

export const reduce: {
  <A, B>(
    b: B,
    baib: (b: B, a: A, i: number) => B,
  ): (self: ReadonlyArray<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(
    b: B,
    abib: (a: A, b: B, i: number) => B,
  ): (self: ReadonlyArray<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
