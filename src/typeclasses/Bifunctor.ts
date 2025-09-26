import { Hkt, Kind } from './Hkt'
import { Functor } from './Functor'
import { flow } from '../utils/flow'

export interface Bifunctor<F extends Hkt> extends Functor<F> {
  readonly mapLeft: <CollectableIn, CollectableOut>(
    ed: (e: CollectableIn) => CollectableOut,
  ) => <In, Fixed>(
    self: Kind<F, In, CollectableIn, Fixed>,
  ) => Kind<F, In, CollectableOut, Fixed>

  readonly bimap: <CollectableIn, CollectableOut, In, Out>(
    ed: (e: CollectableIn) => CollectableOut,
    ab: (a: In) => Out,
  ) => <Fixed>(
    self: Kind<F, In, CollectableIn, Fixed>,
  ) => Kind<F, Out, CollectableOut, Fixed>
}

export const create = <F extends Hkt>(
  Functor: Functor<F>,
  Bifunctor: Pick<Bifunctor<F>, 'mapLeft'>,
): Bifunctor<F> => ({
  ...Functor,
  ...Bifunctor,
  bimap: (ed, ab) => flow(Functor.map(ab), Bifunctor.mapLeft(ed)),
})
