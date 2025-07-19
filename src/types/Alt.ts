import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Alt<F extends HKT> extends TypeClass<F> {
  readonly orElse: {
    <R1, R2, E1, E2, A, B>(
      that: Kind<F, R2, E2, B>,
    ): (self: Kind<F, R1, E2, A>) => Kind<F, R1 | R2, E1 | E2, A | B>
    <R1, R2, E1, E2, A, B>(
      self: Kind<F, R1, E1, A>,
      that: Kind<F, R2, E2, B>,
    ): Kind<F, R1 | R2, E1 | E2, A | B>
  }
}
