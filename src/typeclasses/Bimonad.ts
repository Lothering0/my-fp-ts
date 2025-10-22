import { Bifunctor } from './Bifunctor'
import { Hkt, Kind } from './Hkt'
import { flow } from '../utils/flow'
import { FromIdentityLeft } from './FromIdentityLeft'
import { Monad } from './Monad'

export interface Bimonad<F extends Hkt>
  extends FromIdentityLeft<F>,
    Bifunctor<F>,
    Monad<F> {
  readonly flatLeft: <In1, In2, Collectable, Fixed>(
    self: Kind<F, In1, Kind<F, In2, Collectable, Fixed>, Fixed>,
  ) => Kind<F, In1 | In2, Collectable, Fixed>

  readonly flatMapLeft: <In2, CollectableIn, CollectableOut, Fixed>(
    emd: (e: CollectableIn) => Kind<F, In2, CollectableOut, Fixed>,
  ) => <In1>(
    self: Kind<F, In1, CollectableIn, Fixed>,
  ) => Kind<F, In1 | In2, CollectableOut, Fixed>

  readonly composeLeft: <
    Out,
    CollectableIn,
    CollectableOut1,
    CollectableOut2,
    Fixed,
  >(
    bmc: (d: CollectableOut1) => Kind<F, Out, CollectableOut2, Fixed>,
    amb: (e: CollectableIn) => Kind<F, Out, CollectableOut1, Fixed>,
  ) => (e: CollectableIn) => Kind<F, Out, CollectableOut2, Fixed>
}

export const create = <F extends Hkt>(
  FromIdentityLeft: FromIdentityLeft<F>,
  Bifunctor: Bifunctor<F>,
  Monad: Monad<F>,
  Bimonad: Pick<Bimonad<F>, 'flatLeft'>,
): Bimonad<F> => {
  const { mapLeft } = Bifunctor
  const { flatLeft } = Bimonad

  const flatMapLeft: Bimonad<F>['flatMapLeft'] = emd =>
    flow(mapLeft(emd), flatLeft)

  const composeLeft: Bimonad<F>['composeLeft'] = (g, f) =>
    flow(f, flatMapLeft(g))

  return {
    ...FromIdentityLeft,
    ...Bifunctor,
    ...Monad,
    ...Bimonad,
    flatMapLeft,
    composeLeft,
  }
}
