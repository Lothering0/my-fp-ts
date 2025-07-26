import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Functor<F extends HKT> extends TypeClass<F> {
  readonly map: <A, B>(
    ab: (a: A) => B,
  ) => <_, _2>(self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
}
