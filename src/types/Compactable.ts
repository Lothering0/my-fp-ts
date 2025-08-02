import { Separated } from "../modules/Separated"
import { Result } from "../modules/Result"
import { Option } from "../modules/Option"
import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Compactable<F extends HKT> extends TypeClass<F> {
  readonly compact: <S, E, A>(
    self: Kind<F, S, E, Option<A>>,
  ) => Kind<F, S, E, A>
  readonly compactResults: <S, E, A>(
    self: Kind<F, S, E, Result<unknown, A>>,
  ) => Kind<F, S, E, A>
  readonly separate: <S, E, A, B>(
    self: Kind<F, S, E, Result<A, B>>,
  ) => Separated<Kind<F, S, E, A>, Kind<F, S, E, B>>
}
