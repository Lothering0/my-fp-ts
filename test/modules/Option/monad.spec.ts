import { Number, Option } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  Option.Monad,
  Option.getEquivalence(Number.Equivalence),
  [Option.none(), Option.some(1)],
  [Option.none, a => Option.some(a + 1)],
  [Option.none, b => Option.some(b / 2)],
)
