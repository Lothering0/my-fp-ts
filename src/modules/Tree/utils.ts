import { NonEmptyArray } from "../NonEmptyArray"
import { isNonEmpty } from "../Array"
import { Forest, Tree } from "./tree"
import { pipe } from "../../utils/flow"

export const valueOf: {
  <A>(tree: Tree<A>): A
} = tree => tree.value

export const forestOf: {
  <A>(tree: Tree<A>): Forest<A>
} = tree => tree.forest

export const make: {
  <A>(a: A, forest?: Forest<A>): Tree<A>
} = (value, forest) => ({
  value,
  forest: forest ?? [],
})

export const hasForest = <A>(
  tree: Tree<A>,
): tree is Tree<A> & { readonly forest: NonEmptyArray<A> } =>
  pipe (tree, forestOf, isNonEmpty)
