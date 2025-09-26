import { Hkt } from "../../typeclasses/Hkt"

export interface PredicateHkt extends Hkt {
  readonly Type: Predicate<this["In"]>
}

export interface Predicate<A> {
  (a: A): boolean
}

export interface PredicateWithIndex<A, I> {
  (a: A, i: I): boolean
}
