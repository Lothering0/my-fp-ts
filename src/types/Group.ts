import { Monoid } from "./Monoid"

export interface Group<A> extends Monoid<A> {
  readonly inverse: (a: A) => A
}
