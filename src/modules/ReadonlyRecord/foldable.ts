import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import * as Array from '../ReadonlyArray'
import { flow } from '../../utils/flow'
import { ReadonlyRecord, ReadonlyRecordHkt } from './readonly-record'
import { toEntries, values } from './utils'

export const Foldable: Foldable_.Foldable<ReadonlyRecordHkt> = {
  reduce: (b, bab) => flow(values, Array.Foldable.reduce(b, bab)),
  reduceRight: (b, abb) => flow(values, Array.Foldable.reduceRight(b, abb)),
}

export const FoldableWithIndex: FoldableWithIndex_.FoldableWithIndex<
  ReadonlyRecordHkt,
  string
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) =>
    flow(
      toEntries,
      Array.reduce(b, (out, [k, a]) => baib(out, a, k)),
    ),
  reduceRightWithIndex: (b, abib) =>
    flow(
      toEntries,
      Array.reduceRight(b, ([k, a], out) => abib(a, out, k)),
    ),
}

export const reduce: {
  <A, B, K extends string>(
    b: B,
    baib: (b: B, a: A, i: K) => B,
  ): (record: ReadonlyRecord<K, A>) => B
} = FoldableWithIndex.reduceWithIndex as typeof reduce

export const reduceRight: {
  <A, B, K extends string>(
    b: B,
    abib: (a: A, b: B, i: K) => B,
  ): (record: ReadonlyRecord<K, A>) => B
} = FoldableWithIndex.reduceRightWithIndex as typeof reduceRight
