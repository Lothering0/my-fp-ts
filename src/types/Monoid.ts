import { Semigroup } from "./Semigroup"

export interface Monoid<In> extends Semigroup<In> {
  readonly empty: In
}
