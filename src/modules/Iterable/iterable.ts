import { Hkt } from "../../typeclasses/Hkt"

export interface IterableHkt extends Hkt {
  readonly Type: Iterable<this["In"]>
}
