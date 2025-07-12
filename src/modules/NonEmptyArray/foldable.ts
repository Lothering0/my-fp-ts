import * as A from "../Array"
import * as F from "../../types/Foldable"
import * as FI from "../../types/FoldableWithIndex"
import { NonEmptyArrayHKT } from "./non-empty-array"

export const foldable = {
  ...A.Foldable,
} as F.Foldable<NonEmptyArrayHKT>

export const FoldableWithIndex = {
  ...A.FoldableWithIndex,
} as FI.FoldableWithIndex<NonEmptyArrayHKT, number>

export const { reduce, reduceRight, reduceWithIndex, reduceRightWithIndex } =
  FoldableWithIndex
