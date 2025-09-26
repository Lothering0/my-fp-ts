import { Hkt } from '../../typeclasses/Hkt'
import { _ } from '../../utils/underscore'

export interface StateHkt extends Hkt {
  readonly Type: State<this['Fixed'], this['In']>
}

export interface State<S, A> {
  (s: S): readonly [A, S]
}
