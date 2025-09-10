import { Option, some, none } from "../modules/Option"
import { Result, fail, succeed } from "../modules/Result"
import { Hkt, Kind } from "./Hkt"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { Filterable } from "./Filterable"
import { flow } from "../utils/flow"
import { RefinementWithIndex } from "../modules/Refinement"
import { PredicateWithIndex } from "../modules/Predicate"

export interface FilterableWithIndex<F extends Hkt, Index>
  extends FunctorWithIndex<F, Index>,
    Filterable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: <In, Out, CollectableOut>(
    p: (a: In, i: Index) => Result<Out, CollectableOut>,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => readonly [
    Kind<F, Out, Collectable, Fixed>,
    Kind<F, CollectableOut, Collectable, Fixed>,
  ]

  readonly partitionWithIndex: <In>(
    p: PredicateWithIndex<In, Index>,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => readonly [
    Kind<F, In, Collectable, Fixed>,
    Kind<F, In, Collectable, Fixed>,
  ]

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: <In, Out>(
    p: (a: In, i: Index) => Option<Out>,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>

  readonly filterWithIndex: {
    <In, B extends In>(
      p: RefinementWithIndex<In, B, Index>,
    ): <Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ) => Kind<F, B, Collectable, Fixed>
    <In>(
      p: PredicateWithIndex<In, Index>,
    ): <Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ) => Kind<F, In, Collectable, Fixed>
  }
}

export const createFilterableWithIndex = <F extends Hkt, Index>(
  Filterable: FunctorWithIndex<F, Index> & Filterable<F>,
): FilterableWithIndex<F, Index> => {
  const { compact, separate, mapWithIndex } = Filterable

  const filterMapWithIndex: FilterableWithIndex<
    F,
    Index
  >["filterMapWithIndex"] = p => flow (mapWithIndex (p), compact)

  const filterWithIndex: FilterableWithIndex<F, Index>["filterWithIndex"] = <
    In,
  >(
    p: PredicateWithIndex<In, Index>,
  ) => filterMapWithIndex<In, In> ((a, i) => p (a, i) ? some (a) : none)

  const partitionMapWithIndex: FilterableWithIndex<
    F,
    Index
  >["partitionMapWithIndex"] = p => flow (mapWithIndex (p), separate)

  const partitionWithIndex: FilterableWithIndex<
    F,
    Index
  >["partitionWithIndex"] = p =>
    partitionMapWithIndex ((a, i) => p (a, i) ? succeed (a) : fail (a))

  return {
    ...Filterable,
    partitionMapWithIndex,
    partitionWithIndex,
    filterMapWithIndex,
    filterWithIndex,
  }
}
