import { DoObject, DoObjectKey } from '../types/DoObject'
import { Hkt, Kind } from './Hkt'
import { flow, pipe } from '../utils/flow'
import { FunctorWithIndex } from './FunctorWithIndex'
import { Monad } from './Monad'

export interface MonadWithIndex<F extends Hkt, Index>
  extends FunctorWithIndex<F, Index>,
    Monad<F> {
  readonly flatMapWithIndex: <In, Out, Collectable1, Fixed>(
    aimb: (a: In, i: Index) => Kind<F, Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>

  readonly composeWithIndex: <
    In,
    Out1,
    Out2,
    Collectable1,
    Collectable2,
    Fixed,
  >(
    bimc: (b: Out1, i: Index) => Kind<F, Out2, Collectable2, Fixed>,
    amb: (a: In) => Kind<F, Out1, Collectable1, Fixed>,
  ) => (a: In) => Kind<F, Out2, Collectable1 | Collectable2, Fixed>

  readonly mapToWithIndex: <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In, i: Index) => Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable, Fixed>

  readonly flipApplyToWithIndex: <
    N extends DoObjectKey,
    In,
    Out,
    Collectable1,
    Fixed,
  >(
    name: Exclude<N, keyof In>,
    fab: Kind<F, (a: In, i: Index) => Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable1 | Collectable2, Fixed>

  readonly flatMapToWithIndex: <
    N extends DoObjectKey,
    In,
    Out,
    Collectable1,
    Fixed,
  >(
    name: Exclude<N, keyof In>,
    amb: (a: In, i: Index) => Kind<F, Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable1 | Collectable2, Fixed>
}

export const create = <F extends Hkt, Index>(
  FunctorWithIndex: FunctorWithIndex<F, Index>,
  Monad: Monad<F>,
): MonadWithIndex<F, Index> => {
  const flatMapWithIndex: MonadWithIndex<F, Index>['flatMapWithIndex'] = aimb =>
    flow(FunctorWithIndex.mapWithIndex(aimb), Monad.flat)

  const composeWithIndex: MonadWithIndex<F, Index>['composeWithIndex'] = (
    bmc,
    amb,
  ) => flow(amb, flatMapWithIndex(bmc))

  const mapToWithIndex: MonadWithIndex<F, Index>['mapToWithIndex'] = (
    name,
    aib,
  ) =>
    flatMapWithIndex((a, i) =>
      Monad.of({
        [name]: aib(a, i),
        ...a,
      } as any),
    )

  const flipApplyToWithIndex: MonadWithIndex<
    F,
    Index
  >['flipApplyToWithIndex'] = (name, faib) => self =>
    pipe(
      Monad.Do,
      Monad.bind('a', self),
      Monad.bind('aib', faib),
      FunctorWithIndex.mapWithIndex(
        ({ a, aib }, i) => ({ [name]: aib(a, i), ...a }) as any,
      ),
    )

  const flatMapToWithIndex: MonadWithIndex<F, Index>['flatMapToWithIndex'] = (
    name,
    amib,
  ) =>
    flatMapWithIndex((a, i) =>
      pipe(
        amib(a, i),
        Monad.flatMap(b =>
          Monad.of({
            [name]: b,
            ...a,
          } as any),
        ),
      ),
    )

  return {
    ...FunctorWithIndex,
    ...Monad,
    flatMapWithIndex,
    composeWithIndex,
    mapToWithIndex,
    flipApplyToWithIndex,
    flatMapToWithIndex,
  }
}
