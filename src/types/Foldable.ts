import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Foldable<F extends HKT> extends TypeClass<F> {
  readonly reduce: {
    <R, E, A, B>(b: B, bab: (b: B, a: A) => B): (self: Kind<F, R, E, A>) => B
    <R, E, A, B>(self: Kind<F, R, E, A>, b: B, bab: (b: B, a: A) => B): B
  }
  readonly reduceRight: {
    <R, E, A, B>(b: B, abb: (a: A, b: B) => B): (self: Kind<F, R, E, A>) => B
    <R, E, A, B>(self: Kind<F, R, E, A>, b: B, abb: (a: A, b: B) => B): B
  }
}
