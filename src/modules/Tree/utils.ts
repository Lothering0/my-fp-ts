import { Tree } from "./tree"

type FromTree = <A>(tree: Tree<A>) => A
export const fromTree: FromTree = tree => tree.value
