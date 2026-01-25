import * as List from './list'
import { create } from '../../typeclasses/Bimonad'
import { NonEmptyMonad } from './monad'
import { Comonad } from './comonad'

export const Bimonad = create<List.NonEmptyHkt>(NonEmptyMonad, Comonad)

export const single: {
  <A>(self: List.NonEmpty<A>): List.NonEmpty<A>
} = Bimonad.single as any
