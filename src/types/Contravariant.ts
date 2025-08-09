import { Hkt, Kind } from "./Hkt"
import { TypeClass } from "./TypeClass"

export interface Contravariant<F extends Hkt> extends TypeClass<F> {
  readonly contramap: <A, B>(
    ba: (b: B) => A,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, B>
}
