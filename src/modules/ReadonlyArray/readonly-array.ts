import { Hkt } from "../../types/Hkt"

export interface ReadonlyArrayHkt extends Hkt {
  readonly type: ReadonlyArray<this["_in"]>
}
