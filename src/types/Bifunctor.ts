import { Hkt, Kind } from "./Hkt"
import { Functor } from "./Functor"
import { flow } from "../utils/flow"

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

export const createBifunctor = <F extends Hkt>(
  Bifunctor: Functor<F> & Pick<Bifunctor<F>, "mapLeft">,
): Bifunctor<F> => {
  const { map, mapLeft } = Bifunctor

  return {
    ...Bifunctor,
    bimap: (ed, ab) => flow (map (ab), mapLeft (ed)),
  }
}
