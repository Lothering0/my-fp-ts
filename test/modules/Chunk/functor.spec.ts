import { Number, Chunk } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(Chunk.Functor, Chunk.getEquivalence(Number.Equivalence), [
  Chunk.empty,
  Chunk.make(1),
  Chunk.make(1, 2, 3),
])
