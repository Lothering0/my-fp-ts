import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'

export interface Functor<F extends Hkt> extends TypeClass<F> {
  readonly map: <In, Out>(
    ab: (a: In) => Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>

  readonly as: <Out>(
    a: Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, unknown, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
}

export const create: {
  <F extends Hkt>(Functor: Pick<Functor<F>, 'map'>): Functor<F>
} = Functor => ({
  map: Functor.map,
  as: a => Functor.map(() => a),
})
