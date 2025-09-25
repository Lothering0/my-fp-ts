import * as foldable from "../../typeclasses/Foldable"
import * as foldableWithIndex from "../../typeclasses/FoldableWithIndex"
import * as array from "../../modules/ReadonlyArray"
import { IterableHkt } from "./iterable"
import { flow } from "../../utils/flow"
import { toReadonlyArray } from "./utils"

export const Foldable: foldable.Foldable<IterableHkt> = {
  reduce: (b, bab) => flow (toReadonlyArray, array.Foldable.reduce (b, bab)),
  reduceRight: (b, abb) =>
    flow (toReadonlyArray, array.Foldable.reduceRight (b, abb)),
}

export const FoldableWithIndex: foldableWithIndex.FoldableWithIndex<
  IterableHkt,
  number
> = {
  ...Foldable,
  reduceWithIndex: (b, baib) =>
    flow (toReadonlyArray, array.FoldableWithIndex.reduceWithIndex (b, baib)),
  reduceRightWithIndex: (b, abib) =>
    flow (
      toReadonlyArray,
      array.FoldableWithIndex.reduceRightWithIndex (b, abib),
    ),
}

export const reduce: {
  <A, B>(b: B, baib: (b: B, a: A, i: number) => B): (self: Iterable<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(b: B, abib: (a: A, b: B, i: number) => B): (self: Iterable<A>) => B
} = FoldableWithIndex.reduceRightWithIndex
