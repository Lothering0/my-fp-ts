import { Hkt } from "../../typeclasses/Hkt"

export interface IterableHkt extends Hkt {
  readonly type: Iterable<this["_in"]>
}
