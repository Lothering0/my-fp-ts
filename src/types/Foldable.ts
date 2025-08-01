import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Foldable<F extends HKT> extends TypeClass<F> {
  readonly reduce: <A, B>(
    b: B,
    bab: (b: B, a: A) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => B

  readonly reduceRight: <A, B>(
    b: B,
    abb: (a: A, b: B) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => B
}
