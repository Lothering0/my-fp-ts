import { HKT } from "../../types/HKT"
import { _ } from "../../utils/underscore"

export interface StateHKT extends HKT {
  readonly type: State<this["_E"], this["_A"]>
}

export interface State<S, A> {
  (s: S): [A, S]
}
