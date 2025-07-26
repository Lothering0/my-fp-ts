import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Contravariant<F extends HKT> extends TypeClass<F> {
  readonly contramap: <A, B>(
    ba: (b: B) => A,
  ) => <_, _2>(self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
}
