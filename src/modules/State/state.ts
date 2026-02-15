import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { _ } from '../../utils/underscore'

export interface Hkt extends Hkt_ {
  readonly Type: State<this['Fixed'], this['In']>
}

export interface State<S, A> {
  (s: S): readonly [A, S]
}
