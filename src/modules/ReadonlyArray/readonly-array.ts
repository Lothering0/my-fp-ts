import { Hkt } from "../../typeclasses/Hkt"

export interface ReadonlyArrayHkt extends Hkt {
  readonly type: ReadonlyArray<this["_in"]>
}
