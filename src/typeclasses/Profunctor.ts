import { Functor } from './Functor'
import { Contravariant } from './Contravariant'
import { Hkt, Kind } from './Hkt'
import { flow } from '../utils/flow'

export interface Profunctor<F extends Hkt>
  extends Functor<F>,
    Contravariant<F> {
  readonly promap: <Fixed1, Fixed2, In, Out>(
    ts: (t: Fixed2) => Fixed1,
    ab: (a: In) => Out,
  ) => <Collectable>(
    self: Kind<F, In, Collectable, Fixed1>,
  ) => Kind<F, Out, Collectable, Fixed2>
}

export const create: {
  <F extends Hkt>(
    Functor: Functor<F>,
    Contravariant: Contravariant<F>,
  ): Profunctor<F>
} = (Functor, Contravariant) => ({
  ...Functor,
  ...Contravariant,
  promap: (ts, ab) => flow(Contravariant.contramap(ts), Functor.map(ab)),
})
