import { Equivalence } from '../../typeclasses/Equivalence'
import { length } from './utils'

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<ReadonlyArray<A>>
} = Equivalence => ({
  equals: xs => ys =>
    length(xs) === length(ys) &&
    xs.every((x, i) => Equivalence.equals(x)(ys.at(i)!)),
})
