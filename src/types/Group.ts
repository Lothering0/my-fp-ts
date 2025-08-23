import { Monoid } from "./Monoid"

export interface Group<In> extends Monoid<In> {
  readonly inverse: (a: In) => In
}
