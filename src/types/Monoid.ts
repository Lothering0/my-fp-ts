import { Semigroup } from "./Semigroup"

export interface Monoid<A> extends Semigroup<A> {
  readonly empty: A
}
