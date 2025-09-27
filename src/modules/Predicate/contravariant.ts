import * as Contravariant_ from '../../typeclasses/Contravariant'
import { Predicate, PredicateHkt } from './predicate'
import { flow } from '../../utils/flow'

export const Contravariant: Contravariant_.Contravariant<PredicateHkt> = {
  contramap: ba => self => flow(ba, self),
}

export const contramap: {
  <A, B>(ba: (b: B) => A): (self: Predicate<A>) => Predicate<B>
} = Contravariant.contramap
