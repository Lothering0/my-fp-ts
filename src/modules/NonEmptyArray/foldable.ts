/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { _URI } from "./non-empty-array"
import { Foldable } from "../../types/Foldable"
import { FoldableWithIndex } from "../../types/FoldableWithIndex"

export const foldable: Foldable<typeof _URI> = {
  ...A.foldable,
  _URI,
} as any

export const foldableWithIndex: FoldableWithIndex<typeof _URI, number> = {
  ...A.foldableWithIndex,
  _URI,
} as any

export const { reduce, reduceRight, reduceWithIndex, reduceRightWithIndex } =
  foldableWithIndex
