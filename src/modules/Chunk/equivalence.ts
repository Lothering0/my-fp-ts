import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import * as Equivalence from '../../typeclasses/Equivalence'

export const getEquivalence: {
  <A>(
    Equivalence: Equivalence.Equivalence<A>,
  ): Equivalence.Equivalence<Chunk.Chunk<A>>
} = Iterable.getEquivalence
