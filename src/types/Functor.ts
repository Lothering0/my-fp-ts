import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Functor<F extends HKT> extends TypeClass<F> {
  readonly map: {
    <_, _2, A, B>(
      ab: (a: A) => B,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(self: Kind<F, _, _2, A>, ab: (a: A) => B): Kind<F, _, _2, B>
  }
}
