import * as A from "../Array"
import * as F from "../../types/Foldable"
import * as FI from "../../types/FoldableWithIndex"
import { NonEmptyArray, NonEmptyArrayHKT } from "./non-empty-array"

export const Foldable = {
  ...A.Foldable,
} as F.Foldable<NonEmptyArrayHKT>

export const FoldableWithIndex = {
  ...A.FoldableWithIndex,
} as FI.FoldableWithIndex<NonEmptyArrayHKT, number>

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: NonEmptyArray<A>) => B
  <A, B>(self: NonEmptyArray<A>, b: B, bab: (b: B, a: A) => B): B
} = Foldable.reduce

export const reduceWithIndex: {
  <A, B>(
    b: B,
    ibab: (i: number, b: B, a: A) => B,
  ): (self: NonEmptyArray<A>) => B
  <A, B>(self: NonEmptyArray<A>, b: B, ibab: (i: number, b: B, a: A) => B): B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: NonEmptyArray<A>) => B
  <A, B>(self: NonEmptyArray<A>, b: B, abb: (a: A, b: B) => B): B
} = Foldable.reduceRight

export const reduceRightWithIndex: {
  <A, B>(
    b: B,
    iabb: (i: number, a: A, b: B) => B,
  ): (self: NonEmptyArray<A>) => B
  <A, B>(self: NonEmptyArray<A>, b: B, iabb: (i: number, a: A, b: B) => B): B
} = FoldableWithIndex.reduceRightWithIndex
