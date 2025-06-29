import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Functor<F extends HKT> extends TypeClass<F> {
  readonly map: {
    <E, A, B>(ab: (a: A) => B): (self: Kind<F, E, A>) => Kind<F, E, B>
    <E, A, B>(self: Kind<F, E, A>, ab: (a: A) => B): Kind<F, E, B>
  }
}
