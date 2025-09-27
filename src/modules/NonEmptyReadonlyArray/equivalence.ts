import * as Array from '../ReadonlyArray'
import { Equivalence } from '../../typeclasses/Equivalence'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<NonEmptyReadonlyArray<A>>
} = Array.getEquivalence
