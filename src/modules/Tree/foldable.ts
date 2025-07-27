import * as readonlyArray from "../ReadonlyArray"
import * as foldable from "../../types/Foldable"
import { Tree, TreeHKT } from "./tree"
import { forestOf, valueOf } from "./utils"
import { pipe } from "../../utils/flow"

export const Foldable: foldable.Foldable<TreeHKT> = {
  reduce: (b, bab) => self =>
    readonlyArray.reduce (bab (b, valueOf (self)), (b, tree) =>
      pipe (tree, reduce (b, bab)),
    ) (forestOf (self)),
  reduceRight: (b, abb) => self =>
    abb (
      valueOf (self),
      readonlyArray.reduceRight (b, (tree, b) =>
        pipe (tree, reduceRight (b, abb)),
      ) (forestOf (self)),
    ),
}

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: Tree<A>) => B
} = Foldable.reduce

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: Tree<A>) => B
} = Foldable.reduceRight
