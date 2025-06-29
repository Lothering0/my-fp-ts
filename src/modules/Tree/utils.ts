import { Forest, Tree } from "./tree"

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
