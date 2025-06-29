import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Contravariant<F extends HKT> extends TypeClass<F> {
  readonly contramap: {
    <_, A, B>(ba: (b: B) => A): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, A>, ba: (b: B) => A): Kind<F, _, B>
  }
}
