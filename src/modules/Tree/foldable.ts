import * as A from "../Array"
import { URI } from "./tree"
import { createFoldable, Foldable } from "../../types/Foldable"
import { forestOf, valueOf } from "./utils"

export const foldable: Foldable<URI> = createFoldable ({
  URI,
  reduce: (tree, b, f) =>
    A.reduce (forestOf (tree), f (b, valueOf (tree)), (b, tree) =>
      reduce (tree, b, f),
    ),
  reduceRight: (tree, b, f) =>
    f (
      valueOf (tree),
      A.reduceRight (forestOf (tree), b, (tree, b) => reduceRight (tree, b, f)),
    ),
})

export const { reduce, reduceRight } = foldable
