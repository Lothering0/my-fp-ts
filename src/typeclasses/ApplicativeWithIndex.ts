import { Hkt, Kind } from './Hkt'
import { Applicative } from './Applicative'
import { FunctorWithIndex } from './FunctorWithIndex'
import { flip } from '../utils/flip'
import { MonadWithIndex } from './MonadWithIndex'
import { isFunction } from '../utils/typeChecks'
import { pipe } from '../utils/flow'

export interface ApplicativeWithIndex<F extends Hkt, Index>
  extends FunctorWithIndex<F, Index>,
    Applicative<F> {
  readonly applyWithIndex: <In, Collectable1, Fixed>(
    fa: Kind<F, In, Collectable1, Fixed>,
  ) => <Out, Collectable2>(
    self: Kind<F, (a: In, i: Index) => Out, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
  readonly flipApplyWithIndex: <In, Out, Collectable1, Fixed>(
    fiab: Kind<F, (a: In, i: Index) => Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
}

export const create = <F extends Hkt, Index>(
  Applicative: Applicative<F>,
  MonadWithIndex: MonadWithIndex<F, Index>,
  ApplicativeWithIndex?: Pick<ApplicativeWithIndex<F, Index>, 'applyWithIndex'>,
): ApplicativeWithIndex<F, Index> => {
  let applyWithIndex: ApplicativeWithIndex<F, Index>['applyWithIndex']

  if (isFunction(ApplicativeWithIndex?.applyWithIndex)) {
    applyWithIndex = ApplicativeWithIndex.applyWithIndex
  } else {
    applyWithIndex = fa => self =>
      pipe(
        MonadWithIndex.Do,
        MonadWithIndex.apS('a', fa),
        MonadWithIndex.apS('f', self),
        MonadWithIndex.mapWithIndex(({ f, a }, i) => f(a, i)),
      )
  }

  const flipApplyWithIndex: ApplicativeWithIndex<
    F,
    Index
  >['flipApplyWithIndex'] = flip(applyWithIndex) as typeof flipApplyWithIndex

  return {
    ...Applicative,
    mapWithIndex: MonadWithIndex.mapWithIndex,
    applyWithIndex,
    flipApplyWithIndex,
  }
}
