import * as Contravariant_ from '../../typeclasses/Contravariant'
import { Predicate, PredicateHkt } from './predicate'
import { flow } from '../../utils/flow'

export const Contravariant: Contravariant_.Contravariant<PredicateHkt> = {
  contramap: ba => self => flow(ba, self),
}

export const contramap: {
  <T, S>(ts: (t: T) => S): (self: Predicate<S>) => Predicate<T>
} = Contravariant.contramap
