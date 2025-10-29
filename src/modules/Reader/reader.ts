import { Hkt } from '../../typeclasses/Hkt'

export interface ReaderHkt extends Hkt {
  readonly Type: Reader<this['Fixed'], this['In']>
}

export interface Reader<R, A> {
  (r: R): A
}
