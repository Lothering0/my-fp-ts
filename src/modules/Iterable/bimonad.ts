import * as Iterable from './iterable'
import { create } from '../../typeclasses/Bimonad'
import { NonEmptyMonad } from './monad'
import { Comonad } from './comonad'

export const Bimonad = create(NonEmptyMonad, Comonad)

export const single: {
  <A>(list: Iterable.NonEmpty<A>): Iterable.NonEmpty<A>
} = Bimonad.single
