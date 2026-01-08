import { create } from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Comonad } from './comonad'
import { NonEmptyList } from './non-empty-list'

export const Bimonad = create(Monad, Comonad)

export const single: {
  <A>(list: NonEmptyList<A>): NonEmptyList<A>
} = Bimonad.single
