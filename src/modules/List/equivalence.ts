import { List } from './list'
import { Equivalence } from '../../typeclasses/Equivalence'
import { isCons, isNil } from './refinements'

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<List<A>>
} = Equivalence => ({
  equals: xs => ys => {
    while (isCons(xs) && isCons(ys)) {
      if (!Equivalence.equals(ys.head)(xs.head)) {
        return false
      }
      xs = xs.tail
      ys = ys.tail
    }

    const areBothNil = isNil(xs) && isNil(ys)
    return areBothNil
  },
})
