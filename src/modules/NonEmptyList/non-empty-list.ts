import { Hkt } from '../../typeclasses/Hkt'
import { Cons } from '../List'

export interface NonEmptyListHkt extends Hkt {
  readonly Type: NonEmptyList<this['In']>
}

export type NonEmptyList<A> = Cons<A>
