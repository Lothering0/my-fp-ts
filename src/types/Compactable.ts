import { Separated } from "../modules/Separated"
import { Result } from "../modules/Result"
import { Option } from "../modules/Option"
import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Compactable<F extends HKT> extends TypeClass<F> {
  readonly compact: <_, _2, A>(
    self: Kind<F, _, _2, Option<A>>,
  ) => Kind<F, _, _2, A>
  readonly compactResults: <_, _2, A>(
    self: Kind<F, _, _2, Result<unknown, A>>,
  ) => Kind<F, _, _2, A>
  readonly separate: <_, E, A, B>(
    self: Kind<F, _, E, Result<A, B>>,
  ) => Separated<Kind<F, _, E, A>, Kind<F, _, E, B>>
}
