import * as iterable from "../Iterable"
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
  *[Symbol.iterator]() {
    yield this.value
    for (const tree of this.forest) {
      yield* tree
    }
  },
})

export const hasForest = <A>(tree: Tree<A>): boolean =>
  pipe (tree, forest, iterable.toReadonlyArray, isNonEmpty)
