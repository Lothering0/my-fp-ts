import { Hkt, Kind } from "./Hkt"
import { TypeClass } from "./TypeClass"

export interface Alt<F extends Hkt> extends TypeClass<F> {
  readonly orElse: <S, E1, A>(
    that: Kind<F, S, E1, A>,
  ) => <E2, B>(self: Kind<F, S, E1, B>) => Kind<F, S, E2 | E1, A | B>
}
