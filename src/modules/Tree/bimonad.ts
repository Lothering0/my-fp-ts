import { create } from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Comonad } from './comonad'
import { Tree } from './tree'

export const Bimonad = create(Monad, Comonad)

export const single: {
  <A>(self: Tree<A>): Tree<A>
} = Bimonad.single
