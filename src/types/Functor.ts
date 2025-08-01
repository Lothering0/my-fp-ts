import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Functor<F extends HKT> extends TypeClass<F> {
  readonly map: <A, B>(
    ab: (a: A) => B,
  ) => <S, _>(self: Kind<F, S, _, A>) => Kind<F, S, _, B>
}
