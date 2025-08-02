import { Separated } from "../modules/Separated"
import { Option, some, none } from "../modules/Option"
import { Result, fail, succeed } from "../modules/Result"
import { HKT, Kind } from "./HKT"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { Filterable } from "./Filterable"
import { flow } from "../utils/flow"

export interface FilterableWithIndex<F extends HKT, I>
  extends FunctorWithIndex<F, I>,
    Filterable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: <A, B, C>(
    p: (i: I, a: A) => Result<B, C>,
  ) => <S, E>(
    self: Kind<F, S, E, A>,
  ) => Separated<Kind<F, S, E, B>, Kind<F, S, E, C>>

  readonly partitionWithIndex: <A>(
    p: (i: I, a: A) => boolean,
  ) => <S, E>(
    self: Kind<F, S, E, A>,
  ) => Separated<Kind<F, S, E, A>, Kind<F, S, E, A>>

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: <A, B>(
    p: (i: I, a: A) => Option<B>,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, B>

  readonly filterWithIndex: <A>(
    p: (i: I, a: A) => boolean,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, A>
}

export const createFilterableWithIndex = <F extends HKT, I>(
  Filterable: FunctorWithIndex<F, I> & Filterable<F>,
): FilterableWithIndex<F, I> => {
  const { compact, separate, mapWithIndex } = Filterable

  const filterMapWithIndex: FilterableWithIndex<
    F,
    I
  >["filterMapWithIndex"] = p => flow (mapWithIndex (p), compact)

  const filterWithIndex: FilterableWithIndex<F, I>["filterWithIndex"] = p =>
    filterMapWithIndex ((i, a) => p (i, a) ? some (a) : none)

  const partitionMapWithIndex: FilterableWithIndex<
    F,
    I
  >["partitionMapWithIndex"] = p => flow (mapWithIndex (p), separate)

  const partitionWithIndex: FilterableWithIndex<
    F,
    I
  >["partitionWithIndex"] = p =>
    partitionMapWithIndex ((i, a) => p (i, a) ? succeed (a) : fail (a))

  return {
    ...Filterable,
    partitionMapWithIndex,
    partitionWithIndex,
    filterMapWithIndex,
    filterWithIndex,
  }
}
