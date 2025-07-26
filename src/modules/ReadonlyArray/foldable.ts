import * as F from "../../types/Foldable"
import * as FI from "../../types/FoldableWithIndex"
import { ReadonlyArrayHKT } from "./readonly-array"

export const Foldable: F.Foldable<ReadonlyArrayHKT> = {
  reduce: (b, bab) => self => self.reduce ((b, a) => bab (b, a), b),
  reduceRight: (b, abb) => self => self.reduceRight ((b, a) => abb (a, b), b),
}

export const FoldableWithIndex: FI.FoldableWithIndex<ReadonlyArrayHKT, number> =
  {
    ...Foldable,
    reduceWithIndex: (b, ibab) => self =>
      self.reduce ((b, a, i) => ibab (i, b, a), b),
    reduceRightWithIndex: (b, iabb) => self =>
      self.reduceRight ((b, a, i) => iabb (i, a, b), b),
  }

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: ReadonlyArray<A>) => B
} = Foldable.reduce

export const reduceWithIndex: {
  <A, B>(
    b: B,
    ibab: (i: number, b: B, a: A) => B,
  ): (self: ReadonlyArray<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: ReadonlyArray<A>) => B
} = Foldable.reduceRight

export const reduceRightWithIndex: {
  <A, B>(
    b: B,
    iabb: (i: number, a: A, b: B) => B,
  ): (self: ReadonlyArray<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
