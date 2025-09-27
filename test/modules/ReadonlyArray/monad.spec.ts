import { Number, Array } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  Array.Monad,
  Array.getEquivalence(Number.Equivalence),
  [[], [1], [1, 2, 3]],
  [() => [], a => [a + 1], a => [a + 1, a + 2, a + 3]],
  [() => [], b => [b / 2, b / 3, b / 4]],
)
