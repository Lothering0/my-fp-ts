import { Number, Record } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(Record.Functor, Record.getEquivalence(Number.Equivalence), [
  {},
  { a: 1 },
  { a: 1, b: 2, c: 3 },
])
