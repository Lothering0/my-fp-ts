import { number, option } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  option.Applicative,
  option.getEquivalence(number.Equivalence),
  [option.none, option.some(1)],
  [option.none, option.some(number.add(5))],
)
