import * as RA from "../ReadonlyArray"
import * as F from "../../types/Foldable"
import * as FI from "../../types/FoldableWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"

export const Foldable = {
  ...RA.Foldable,
} as F.Foldable<NonEmptyReadonlyArrayHKT>

export const FoldableWithIndex = {
  ...RA.FoldableWithIndex,
} as FI.FoldableWithIndex<NonEmptyReadonlyArrayHKT, number>

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: NonEmptyReadonlyArray<A>) => B
} = Foldable.reduce

export const reduceWithIndex: {
  <A, B>(
    b: B,
    ibab: (i: number, b: B, a: A) => B,
  ): (self: NonEmptyReadonlyArray<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: NonEmptyReadonlyArray<A>) => B
} = Foldable.reduceRight

export const reduceRightWithIndex: {
  <A, B>(
    b: B,
    iabb: (i: number, a: A, b: B) => B,
  ): (self: NonEmptyReadonlyArray<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
