import * as Comonad_ from '../../typeclasses/Comonad'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'
import { head } from './utils'
import { Extendable } from './extendable'

export const Comonad: Comonad_.Comonad<NonEmptyListHkt> = {
  ...Extendable,
  extract: head,
}

export const extract: {
  <A>(list: NonEmptyList<A>): A
} = Comonad.extract
