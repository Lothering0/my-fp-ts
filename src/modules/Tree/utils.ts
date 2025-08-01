import { NonEmptyReadonlyArray } from "../NonEmptyReadonlyArray"
import { isNonEmpty } from "../ReadonlyArray"
import { Forest, Tree } from "./tree"
import { pipe } from "../../utils/flow"

export const value: {
  <A>(tree: Tree<A>): A
} = tree => tree.value

export const forest: {
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
): tree is Tree<A> & { readonly forest: NonEmptyReadonlyArray<A> } =>
  pipe (tree, forest, isNonEmpty)
