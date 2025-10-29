import { Hkt } from '../../typeclasses/Hkt'

export interface PredicateHkt extends Hkt {
  readonly Type: Predicate<this['Fixed']>
}

export interface Predicate<S> {
  (s: S): boolean
}

export interface PredicateWithIndex<S, I> {
  (s: S, i: I): boolean
}
