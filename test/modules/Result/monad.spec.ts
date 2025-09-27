import { Number, Result, String } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  Result.Monad,
  Result.getEquivalence(Number.Equivalence, String.Equivalence),
  [Result.fail('e'), Result.succeed(1)],
  [() => Result.fail('e'), a => Result.succeed(a + 1)],
  [() => Result.fail('e'), b => Result.succeed(b / 2)],
)
