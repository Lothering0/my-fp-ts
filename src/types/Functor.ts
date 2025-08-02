import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Functor<F extends HKT> extends TypeClass<F> {
  readonly map: <A, B>(
    ab: (a: A) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, B>
}
