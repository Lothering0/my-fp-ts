import { Separated } from "../modules/Separated"
import { Either } from "../modules/Either"
import { Option } from "../modules/Option"
import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Compactable<F extends HKT> extends TypeClass<F> {
  readonly compact: <_, _2, A>(
    ffa: Kind<F, _, _2, Option<A>>,
  ) => Kind<F, _, _2, A>
  readonly compactEithers: <_, _2, A>(
    ffa: Kind<F, _, _2, Either<unknown, A>>,
  ) => Kind<F, _, _2, A>
  readonly separate: <_, E, A, B>(
    ffa: Kind<F, _, E, Either<A, B>>,
  ) => Separated<Kind<F, _, E, A>, Kind<F, _, E, B>>
}
