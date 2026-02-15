import { Hkt as Hkt_ } from '../../typeclasses/Hkt'

export interface Hkt extends Hkt_ {
  readonly Type: Reader<this['Fixed'], this['In']>
}

export interface Reader<R, A> {
  (r: R): A
}
