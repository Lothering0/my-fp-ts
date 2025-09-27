import { Number, Option } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  Option.Applicative,
  Option.getEquivalence(Number.Equivalence),
  [Option.none, Option.some(1)],
  [Option.none, Option.some(Number.add(5))],
)
