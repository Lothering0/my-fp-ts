import { Number, Result, String } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  Result.Applicative,
  Result.getEquivalence(String.Equivalence, Number.Equivalence),
  [Result.fail('a'), Result.succeed(1)],
  [Result.fail('a'), Result.succeed(Number.add(5))],
)
