import { create } from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Comonad } from './comonad'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'

export const Bimonad = create(Monad, Comonad)

export const single: {
  <A>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A>
} = Bimonad.single
