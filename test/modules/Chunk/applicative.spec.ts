import { Number, Chunk } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  Chunk.Applicative,
  Chunk.getEquivalence(Number.Equivalence),
  [Chunk.empty, Chunk.make(1), Chunk.make(1, 2, 3)],
  [
    Chunk.empty,
    Chunk.make(Number.add(1)),
    Chunk.make(Number.add(3), Number.add(4)),
  ],
)
