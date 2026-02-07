import { Number, Iterable } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(
  Iterable.Functor,
  Iterable.getEquivalence(Number.Equivalence),
  [[], [1], [1, 2, 3]],
)
