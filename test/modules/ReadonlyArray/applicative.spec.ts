import { Number, Array } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  Array.Applicative,
  Array.getEquivalence(Number.Equivalence),
  [[], [1], [1, 2, 3]],
  [[], [Number.add(1)], [Number.add(3), Number.add(4)]],
)
