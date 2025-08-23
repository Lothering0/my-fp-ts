import { Hkt } from "../../types/Hkt"
import { _ } from "../../utils/underscore"

export interface StateHkt extends Hkt {
  readonly type: State<this["_fixed"], this["_in"]>
}

export interface State<S, A> {
  (s: S): readonly [A, S]
}
