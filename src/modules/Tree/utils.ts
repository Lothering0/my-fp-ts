import * as Iterable from '../Iterable'
import * as Array from '../ReadonlyArray'
import { Show } from '../../typeclasses/Show'
import { isNonEmpty } from '../ReadonlyArray'
import { Forest, Tree } from './tree'
import { pipe as pipe_, flow } from '../../utils/flow'
import { nonEmpty, pipe } from '../_internal'

export const valueOf: {
  <A>(tree: Tree<A>): A
} = tree => tree.value

export const forestOf: {
  <A>(tree: Tree<A>): Forest<A>
} = tree => tree.forest

export const make: {
  <A>(a: A, forest?: Forest<A>): Tree<A>
} = (value, forest = []) =>
  Object.freeze({
    [nonEmpty]: undefined,
    value,
    forest,
    pipe,
    *[Symbol.iterator]() {
      yield value
      for (const tree of forest) {
        yield* tree
      }
    },
  })

export const hasForest = <A>(tree: Tree<A>): boolean =>
  pipe_(tree, forestOf, Iterable.toReadonlyArray, isNonEmpty)

const draw: {
  <A>(Show: Show<A>): (tree: Tree<A>) => (level: number) => string
} = Show => tree => level => {
  let out = `${Show.show(tree.value)}`
  const forestArray = [...tree.forest]

  for (let i = 0; i < forestArray.length; i++) {
    const tree = forestArray[i]!
    const isLastElement = i === Array.lastIndex(forestArray)
    const hasTreeForest = hasForest(tree)
    const chars = hasTreeForest || isLastElement ? '└─' : '├─'

    const indentation = '   '.repeat(level)
    const value = hasTreeForest
      ? draw(Show)(tree)(level + 1)
      : Show.show(tree.value)
    out = `${out}\n${indentation}${chars} ${value}`
  }

  return out
}

export const drawTree: {
  <A>(Show: Show<A>): (tree: Tree<A>) => string
} = Show => tree => draw(Show)(tree)(0)

export const drawForest: {
  <A>(Show: Show<A>): (forest: Forest<A>) => string
} = Show =>
  flow(Iterable.map(drawTree(Show)), Iterable.toReadonlyArray, Array.join('\n'))
