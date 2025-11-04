import { flow } from '../utils/flow'
import { Comonad } from './Comonad'
import { Hkt, Kind } from './Hkt'
import { Monad } from './Monad'

export interface Bimonad<F extends Hkt> extends Monad<F>, Comonad<F> {
  readonly single: <In, Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, In, Collectable, Fixed>
}

export const create: {
  <F extends Hkt>(Monad: Monad<F>, Comonad: Comonad<F>): Bimonad<F>
} = (Monad, Comonad) => ({
  ...Monad,
  ...Comonad,
  single: flow(Comonad.extract, Monad.of),
})
