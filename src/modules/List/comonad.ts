import * as List from './list'
import * as Comonad_ from '../../typeclasses/Comonad'
import { headNonEmpty } from './utils'
import { NonEmptyExtendable } from './extendable'

export const Comonad: Comonad_.Comonad<List.NonEmptyHkt> = {
  ...NonEmptyExtendable,
  extract: headNonEmpty,
}

export const extract: {
  <A>(self: List.NonEmpty<A>): A
} = Comonad.extract
