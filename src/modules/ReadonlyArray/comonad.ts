import * as Array from './readonly-array'
import * as Comonad_ from '../../typeclasses/Comonad'
import { headNonEmpty } from './utils'
import { Extendable } from './extendable'

export const Comonad: Comonad_.Comonad<Array.NonEmptyHkt> = {
  ...(Extendable as any),
  extract: headNonEmpty,
}

export const extract: {
  <A>(self: Array.NonEmpty<A>): A
} = Comonad.extract
