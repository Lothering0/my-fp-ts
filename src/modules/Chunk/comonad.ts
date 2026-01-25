import * as Chunk from './chunk'
import * as Comonad_ from '../../typeclasses/Comonad'
import { headNonEmpty } from './utils'
import { NonEmptyExtendable } from './extendable'

export const Comonad: Comonad_.Comonad<Chunk.NonEmptyHkt> = {
  ...NonEmptyExtendable,
  extract: headNonEmpty,
}

export const extract: {
  <A>(self: Chunk.NonEmpty<A>): A
} = Comonad.extract
