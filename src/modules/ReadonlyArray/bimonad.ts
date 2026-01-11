import * as Array from './readonly-array'
import { create } from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Comonad } from './comonad'

export const Bimonad = create<Array.NonEmptyHkt>(Monad as any, Comonad)

export const single: {
  <A>(self: Array.NonEmpty<A>): Array.NonEmpty<A>
} = Bimonad.single as any
