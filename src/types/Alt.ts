import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Alt<F extends HKT> extends TypeClass<F> {
  readonly orElse: <R1, E1, A>(
    that: Kind<F, R1, E1, A>,
  ) => <R2, E2, B>(self: Kind<F, R2, E1, B>) => Kind<F, R2 | R1, E2 | E1, A | B>
}
