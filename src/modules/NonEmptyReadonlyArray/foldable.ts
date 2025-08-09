import * as readonlyArray from "../ReadonlyArray"
import * as foldable from "../../types/Foldable"
import * as foldableWithIndex from "../../types/FoldableWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from "./non-empty-readonly-array"

export const Foldable = {
  ...readonlyArray.Foldable,
} as foldable.Foldable<NonEmptyReadonlyArrayHkt>

export const FoldableWithIndex = {
  ...readonlyArray.FoldableWithIndex,
} as foldableWithIndex.FoldableWithIndex<NonEmptyReadonlyArrayHkt, number>

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
