import { Separated } from "../modules/Separated"
import { Result } from "../modules/Result"
import { Option } from "../modules/Option"
import { Hkt, Kind } from "./Hkt"
import { TypeClass } from "./TypeClass"

export interface Compactable<F extends Hkt> extends TypeClass<F> {
  readonly compact: <In, Collectable, Fixed>(
    self: Kind<F, Option<In>, Collectable, Fixed>,
  ) => Kind<F, In, Collectable, Fixed>
  readonly compactResults: <In, Collectable, Fixed>(
    self: Kind<F, Result<unknown, In>, Collectable, Fixed>,
  ) => Kind<F, In, Collectable, Fixed>
  readonly separate: <In1, In2, Collectable, Fixed>(
    self: Kind<F, Result<In1, In2>, Collectable, Fixed>,
  ) => Separated<
    Kind<F, In1, Collectable, Fixed>,
    Kind<F, In2, Collectable, Fixed>
  >
}
