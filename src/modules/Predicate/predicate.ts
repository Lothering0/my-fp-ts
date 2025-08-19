import { Hkt } from "../../types/Hkt"

export interface PredicateHkt extends Hkt {
  readonly type: Predicate<this["_A"]>
}

export interface Predicate<A> {
  (a: A): boolean
}

export interface PredicateWithIndex<I, A> {
  (i: I, a: A): boolean
}
