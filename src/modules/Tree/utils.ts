import * as iterable from '../Iterable'
import { isNonEmpty } from '../ReadonlyArray'
import { Forest, Tree } from './tree'
import { pipe } from '../../utils/flow'

export const valueOf: {
  <A>(tree: Tree<A>): A
} = tree => tree.value

export const forestOf: {
  <A>(tree: Tree<A>): Forest<A>
} = tree => tree.forest

export const make: {
  <A>(a: A, forest?: Forest<A>): Tree<A>
} = (value, forest = []) => ({
  value,
  forest,
  *[Symbol.iterator]() {
    yield value
    for (const tree of forest) {
      yield* tree
    }
  },
})

export const hasForest = <A>(tree: Tree<A>): boolean =>
  pipe(tree, forestOf, iterable.toReadonlyArray, isNonEmpty)
