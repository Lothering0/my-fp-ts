import * as readonlyArray from "../ReadonlyArray"
import * as foldable from "../../types/Foldable"
import { Tree, TreeHKT } from "./tree"
import { forest, value } from "./utils"
import { pipe } from "../../utils/flow"

export const Foldable: foldable.Foldable<TreeHKT> = {
  reduce: (b, bab) => self =>
    readonlyArray.reduce (bab (b, value (self)), (b, tree) =>
      pipe (tree, reduce (b, bab)),
    ) (forest (self)),
  reduceRight: (b, abb) => self =>
    abb (
      value (self),
      readonlyArray.reduceRight (b, (tree, b) =>
        pipe (tree, reduceRight (b, abb)),
      ) (forest (self)),
    ),
}

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: Tree<A>) => B
} = Foldable.reduce

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: Tree<A>) => B
} = Foldable.reduceRight
