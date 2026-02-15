import * as Array from './readonly-array'
import { create } from '../../typeclasses/Bimonad'
import { NonEmptyMonad } from './monad'
import { Comonad } from './comonad'

export const Bimonad = create<Array.NonEmptyHkt>(NonEmptyMonad, Comonad)

export const single: {
  <A>(array: Array.NonEmpty<A>): Array.NonEmpty<A>
} = Bimonad.single as any
