import { Separated } from "../modules/Separated"
import { Result } from "../modules/Result"
import { Option } from "../modules/Option"
import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Compactable<F extends HKT> extends TypeClass<F> {
  readonly compact: <S, _, A>(
    self: Kind<F, S, _, Option<A>>,
  ) => Kind<F, S, _, A>
  readonly compactResults: <S, _, A>(
    self: Kind<F, S, _, Result<unknown, A>>,
  ) => Kind<F, S, _, A>
  readonly separate: <S, E, A, B>(
    self: Kind<F, S, E, Result<A, B>>,
  ) => Separated<Kind<F, S, E, A>, Kind<F, S, E, B>>
}
