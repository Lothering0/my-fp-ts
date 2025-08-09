import { HKT } from "../../types/HKT"
import { _ } from "../../utils/underscore"

export interface StateHKT extends HKT {
  readonly type: State<this["_S"], this["_A"]>
}

export interface State<S, A> {
  (s: S): readonly [A, S]
}
