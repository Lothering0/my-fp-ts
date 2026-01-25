import * as Iterable from './iterable'
import * as Comonad_ from '../../typeclasses/Comonad'
import { headNonEmpty } from './utils'
import { NonEmptyExtendable } from './extendable'

export const Comonad: Comonad_.Comonad<Iterable.NonEmptyHkt> = {
  ...NonEmptyExtendable,
  extract: headNonEmpty,
}

export const extract: {
  <A>(list: Iterable.NonEmpty<A>): A
} = Comonad.extract
