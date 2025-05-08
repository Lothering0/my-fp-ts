import { createFoldable, Foldable } from "../../types/Foldable"
import {
  createFoldableWithIndex,
  FoldableWithIndex,
} from "../../types/FoldableWithIndex"

export const foldable: Foldable<"Array"> = createFoldable ({
  _URI: "Array",
  reduce: (xs, b, f) => xs.reduce ((b, a) => f (b, a), b),
  reduceRight: (xs, b, f) => xs.reduceRight ((b, a) => f (a, b), b),
})

export const foldableWithIndex: FoldableWithIndex<"Array", number> =
  createFoldableWithIndex ({
    ...foldable,
    reduceWithIndex: (xs, b, f) => xs.reduce ((b, a, i) => f (i, b, a), b),
    reduceRightWithIndex: (xs, b, f) =>
      xs.reduceRight ((b, a, i) => f (i, a, b), b),
  })

export const { reduce, reduceRight, reduceWithIndex, reduceRightWithIndex } =
  foldableWithIndex
