/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { URI } from "./non-empty-array"
import { Foldable } from "../../types/Foldable"
import { FoldableWithIndex } from "../../types/FoldableWithIndex"

export const foldable: Foldable<URI> = {
  ...A.foldable,
  URI,
} as any

export const foldableWithIndex: FoldableWithIndex<URI, number> = {
  ...A.foldableWithIndex,
  URI,
} as any

export const { reduce, reduceRight, reduceWithIndex, reduceRightWithIndex } =
  foldableWithIndex
