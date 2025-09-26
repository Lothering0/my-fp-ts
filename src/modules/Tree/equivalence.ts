import * as iterable from '../Iterable'
import { Tree } from './tree'
import { Equivalence } from '../../typeclasses/Equivalence'
import { forestOf, valueOf } from './utils'
import { pipe } from '../../utils/flow'

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<Tree<A>>
} = Equivalence => ({
  equals: mx => my => {
    const IterableEquivalence = pipe(
      Equivalence,
      getEquivalence,
      iterable.getEquivalence,
    )
    const areValuesEqual = pipe(mx, valueOf, Equivalence.equals(valueOf(my)))
    const areForestsEqual = pipe(
      mx,
      forestOf,
      IterableEquivalence.equals(forestOf(my)),
    )
    return areValuesEqual && areForestsEqual
  },
})
