import * as RA from "../ReadonlyArray"
import * as F from "../../types/Foldable"
import { Tree, TreeHKT } from "./tree"
import { forestOf, valueOf } from "./utils"
import { overload } from "../../utils/overloads"

export const Foldable: F.Foldable<TreeHKT> = {
  reduce: overload (
    2,
    <A, B>(self: Tree<A>, b: B, bab: (b: B, a: A) => B): B =>
      RA.reduce (forestOf (self), bab (b, valueOf (self)), (b, tree) =>
        reduce (tree, b, bab),
      ),
  ),
  reduceRight: overload (
    2,
    <A, B>(self: Tree<A>, b: B, abb: (a: A, b: B) => B): B =>
      abb (
        valueOf (self),
        RA.reduceRight (forestOf (self), b, (tree, b) =>
          reduceRight (tree, b, abb),
        ),
      ),
  ),
}

export const reduce: {
  <A, B>(b: B, bab: (b: B, a: A) => B): (self: Tree<A>) => B
  <A, B>(self: Tree<A>, b: B, bab: (b: B, a: A) => B): B
} = Foldable.reduce

export const reduceRight: {
  <A, B>(b: B, abb: (a: A, b: B) => B): (self: Tree<A>) => B
  <A, B>(self: Tree<A>, b: B, abb: (a: A, b: B) => B): B
} = Foldable.reduceRight
