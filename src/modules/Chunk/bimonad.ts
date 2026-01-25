import * as Chunk from './chunk'
import { create } from '../../typeclasses/Bimonad'
import { NonEmptyMonad } from './monad'
import { Comonad } from './comonad'

export const Bimonad = create<Chunk.NonEmptyHkt>(NonEmptyMonad, Comonad)

export const single: {
  <A>(self: Chunk.NonEmpty<A>): Chunk.NonEmpty<A>
} = Bimonad.single as any
