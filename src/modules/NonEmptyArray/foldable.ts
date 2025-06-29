import * as A from "../Array"
import { NonEmptyArrayHKT } from "./non-empty-array"
import { Foldable } from "../../types/Foldable"
import { FoldableWithIndex } from "../../types/FoldableWithIndex"

export const foldable: Foldable<NonEmptyArrayHKT> = {
  ...A.foldable,
} as Foldable<NonEmptyArrayHKT>

export const foldableWithIndex: FoldableWithIndex<NonEmptyArrayHKT, number> = {
  ...A.foldableWithIndex,
} as FoldableWithIndex<NonEmptyArrayHKT, number>

export const { reduce, reduceRight, reduceWithIndex, reduceRightWithIndex } =
  foldableWithIndex
