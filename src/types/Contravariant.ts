import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Contravariant<F extends HKT> extends TypeClass<F> {
  readonly contramap: {
    <_, _2, A, B>(
      ba: (b: B) => A,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(self: Kind<F, _, _2, A>, ba: (b: B) => A): Kind<F, _, _2, B>
  }
}
