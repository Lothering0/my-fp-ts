import { Option, some, none } from '../modules/Option'
import { Result, fail, succeed } from '../modules/Result'
import { Compactable } from './Compactable'
import { Functor } from './Functor'
import { Hkt, Kind } from './Hkt'
import { Predicate } from '../modules/Predicate'
import { flow } from '../utils/flow'
import { Refinement } from '../modules/Refinement'

export interface Filterable<F extends Hkt> extends Functor<F>, Compactable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: <In, Out, CollectableOut>(
    p: (a: In) => Result<Out, CollectableOut>,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => readonly [
    Kind<F, Out, Collectable, Fixed>,
    Kind<F, CollectableOut, Collectable, Fixed>,
  ]

  readonly partition: <In>(
    p: Predicate<In>,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => readonly [
    Kind<F, In, Collectable, Fixed>,
    Kind<F, In, Collectable, Fixed>,
  ]

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: <In, Out>(
    p: (a: In) => Option<Out>,
  ) => <Fixed, Collectable>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>

  readonly filter: {
    <In, B extends In>(
      p: Refinement<In, B>,
    ): <Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ) => Kind<F, B, Collectable, Fixed>
    <In>(
      p: Predicate<In>,
    ): <Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ) => Kind<F, In, Collectable, Fixed>
  }
}

export const create = <F extends Hkt>(
  Functor: Functor<F>,
  Filterable: Compactable<F>,
): Filterable<F> => {
  const { map } = Functor
  const { compact, separate } = Filterable

  const filterMap: Filterable<F>['filterMap'] = p => flow(map(p), compact)

  const filter: Filterable<F>['filter'] = <In>(p: Predicate<In>) =>
    filterMap<In, In>(a => (p(a) ? some(a) : none))

  const partitionMap: Filterable<F>['partitionMap'] = p =>
    flow(map(p), separate)

  const partition: Filterable<F>['partition'] = p =>
    partitionMap(a => (p(a) ? succeed(a) : fail(a)))

  return {
    ...Functor,
    ...Filterable,
    partitionMap,
    partition,
    filterMap,
    filter,
  }
}
