import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Contravariant<F extends HKT> extends TypeClass<F> {
  readonly contramap: <A, B>(
    ba: (b: B) => A,
  ) => <S, _>(self: Kind<F, S, _, A>) => Kind<F, S, _, B>
}
