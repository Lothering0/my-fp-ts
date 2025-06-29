import * as A from "../Array"
import { Tree, TreeHKT } from "./tree"
import { Foldable } from "../../types/Foldable"
import { forestOf, valueOf } from "./utils"
import { overload } from "src/utils/overloads"

export const foldable: Foldable<TreeHKT> = {
  reduce: overload (
    2,
    <A, B>(self: Tree<A>, b: B, bab: (b: B, a: A) => B): B =>
      A.reduce (forestOf (self), bab (b, valueOf (self)), (b, tree) =>
        reduce (tree, b, bab),
      ),
  ),
  reduceRight: overload (
    2,
    <A, B>(self: Tree<A>, b: B, abb: (a: A, b: B) => B): B =>
      abb (
        valueOf (self),
        A.reduceRight (forestOf (self), b, (tree, b) =>
          reduceRight (tree, b, abb),
        ),
      ),
  ),
}

export const { reduce, reduceRight } = foldable
