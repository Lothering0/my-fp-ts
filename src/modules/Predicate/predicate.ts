import { HKT } from "../../types/HKT"

export interface PredicateHKT extends HKT {
  readonly type: Predicate<this["_A"]>
}

export interface Predicate<A> {
  (a: A): boolean
}
