import { Forest, Tree } from "./tree"

type ValueOf = <A>(tree: Tree<A>) => A
export const valueOf: ValueOf = tree => tree.value

type ForestOf = <A>(tree: Tree<A>) => Forest<A>
export const forestOf: ForestOf = tree => tree.forest

type Make = <A>(a: A, forest?: Forest<A>) => Tree<A>
export const make: Make = (value, forest) => ({
  value,
  forest: forest ?? [],
})
