import { Bifunctor } from './Bifunctor'
import { Hkt, Kind } from './Hkt'
import { flow } from '../utils/flow'
import { FromIdentityLeft } from './FromIdentityLeft'
import { Monad } from './Monad'

export interface MonadBoth<F extends Hkt>
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
    amb: (e: CollectableIn) => Kind<F, Out, CollectableOut1, Fixed>,
    bmc: (d: CollectableOut1) => Kind<F, Out, CollectableOut2, Fixed>,
  ) => (e: CollectableIn) => Kind<F, Out, CollectableOut2, Fixed>
}

export const create = <F extends Hkt>(
  FromIdentityLeft: FromIdentityLeft<F>,
  Bifunctor: Bifunctor<F>,
  Monad: Monad<F>,
  MonadBoth: Pick<MonadBoth<F>, 'flatLeft'>,
): MonadBoth<F> => {
  const { mapLeft } = Bifunctor
  const { flatLeft } = MonadBoth

  const flatMapLeft: MonadBoth<F>['flatMapLeft'] = emd =>
    flow(mapLeft(emd), flatLeft)

  const composeLeft: MonadBoth<F>['composeLeft'] = (f, g) =>
    flow(f, flatMapLeft(g))

  return {
    ...FromIdentityLeft,
    ...Bifunctor,
    ...Monad,
    ...MonadBoth,
    flatMapLeft,
    composeLeft,
  }
}
