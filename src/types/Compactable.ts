import { Separated } from "../modules/Separated"
import { Either } from "../modules/Either"
import { Option } from "../modules/Option"
import { HKT, Kind } from "./HKT"
import { TypeClass } from "./TypeClass"

export interface Compactable<F extends HKT> extends TypeClass<F> {
  readonly compact: <_, A>(ffa: Kind<F, _, Option<A>>) => Kind<F, _, A>
  readonly compactEithers: <_, A>(
    ffa: Kind<F, _, Either<unknown, A>>,
  ) => Kind<F, _, A>
  readonly separate: <E, A, B>(
    ffa: Kind<F, E, Either<A, B>>,
  ) => Separated<Kind<F, E, A>, Kind<F, E, B>>
}
