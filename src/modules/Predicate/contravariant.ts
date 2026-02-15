import * as Contravariant_ from '../../typeclasses/Contravariant'
import { Predicate, PredicateHkt } from './predicate'
import { flow } from '../../utils/flow'

export const Contravariant: Contravariant_.Contravariant<PredicateHkt> = {
  contramap: ba => p => flow(ba, p),
}

export const contramap: {
  <T, S>(ts: (t: T) => S): (p: Predicate<S>) => Predicate<T>
} = Contravariant.contramap
