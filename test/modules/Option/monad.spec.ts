import { number, option } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  option.Monad,
  option.getEquivalence(number.Equivalence),
  [option.none, option.some(1)],
  [option.zero, a => option.some(a + 1)],
  [option.zero, b => option.some(b / 2)],
)
