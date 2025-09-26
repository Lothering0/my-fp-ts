import { number, record } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(record.Functor, record.getEquivalence(number.Equivalence), [
  {},
  { a: 1 },
  { a: 1, b: 2, c: 3 },
])
