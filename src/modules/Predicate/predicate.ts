import { Hkt as Hkt_ } from '../../typeclasses/Hkt'

export interface Hkt extends Hkt_ {
  readonly Type: Predicate<this['Fixed']>
}

export interface Predicate<S> {
  (s: S): boolean
}

export interface PredicateWithIndex<S, I> {
  (s: S, i: I): boolean
}
