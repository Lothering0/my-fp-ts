import { number, result, string } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  result.Monad,
  result.getEquivalence(string.Equivalence, number.Equivalence),
  [result.fail('e'), result.succeed(1)],
  [() => result.fail('e'), a => result.succeed(a + 1)],
  [() => result.fail('e'), b => result.succeed(b / 2)],
)
