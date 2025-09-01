import * as foldable from "../../types/Foldable"
import * as foldableWithIndex from "../../types/FoldableWithIndex"
import * as readonlyArray from "../ReadonlyArray"
import { flow } from "../../utils/flow"
import { ReadonlyRecord, ReadonlyRecordHkt } from "./readonly-record"
import { toEntries, values } from "./utils"

export const Foldable: foldable.Foldable<ReadonlyRecordHkt> = {
  reduce: (b, bab) => flow (values, readonlyArray.Foldable.reduce (b, bab)),
  reduceRight: (b, abb) =>
    flow (values, readonlyArray.Foldable.reduceRight (b, abb)),
}

export const FoldableWithIndex: foldableWithIndex.FoldableWithIndex<
  ReadonlyRecordHkt,
  string
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) =>
    flow (
      toEntries,
      readonlyArray.reduce (b, (out, [k, a]) => baib (out, a, k)),
    ),
  reduceRightWithIndex: (b, abib) =>
    flow (
      toEntries,
      readonlyArray.reduceRight (b, ([k, a], out) => abib (a, out, k)),
    ),
}

export const reduce: {
  <A, B, K extends string>(
    b: B,
    baib: (b: B, a: A, i: K) => B,
  ): (self: ReadonlyRecord<K, A>) => B
} = FoldableWithIndex.reduceWithIndex as typeof reduce

export const reduceRight: {
  <A, B, K extends string>(
    b: B,
    abib: (a: A, b: B, i: K) => B,
  ): (self: ReadonlyRecord<K, A>) => B
} = FoldableWithIndex.reduceRightWithIndex as typeof reduceRight
