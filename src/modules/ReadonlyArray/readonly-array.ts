import { HKT } from "../../types/HKT"

export interface ReadonlyArrayHKT extends HKT {
  readonly type: ReadonlyArray<this["_A"]>
}
