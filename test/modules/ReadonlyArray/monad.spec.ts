import { number, array } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  array.Monad,
  array.getEquivalence(number.Equivalence),
  [[], [1], [1, 2, 3]],
  [() => [], a => [a + 1], a => [a + 1, a + 2, a + 3]],
  [() => [], b => [b / 2, b / 3, b / 4]],
)
