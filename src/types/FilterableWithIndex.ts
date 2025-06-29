import { Separated } from "../modules/Separated"
import { Option, some, none } from "../modules/Option"
import { Either, left, right } from "../modules/Either"
import { HKT, Kind } from "./HKT"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { Filterable } from "./Filterable"
import { pipe } from "src/utils/flow"
import { overload } from "src/utils/overloads"

export interface FilterableWithIndex<F extends HKT, I>
  extends FunctorWithIndex<F, I>,
    Filterable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: {
    <E, A, B, C>(
      p: (i: I, a: A) => Either<B, C>,
    ): (self: Kind<F, E, A>) => Separated<Kind<F, E, B>, Kind<F, E, C>>
    <E, A, B, C>(
      self: Kind<F, E, A>,
      p: (i: I, a: A) => Either<B, C>,
    ): Separated<Kind<F, E, B>, Kind<F, E, C>>
  }

  readonly partitionWithIndex: {
    <E, A>(
      p: (i: I, a: A) => boolean,
    ): (self: Kind<F, E, A>) => Separated<Kind<F, E, A>, Kind<F, E, A>>
    <E, A>(
      self: Kind<F, E, A>,
      p: (i: I, a: A) => boolean,
    ): Separated<Kind<F, E, A>, Kind<F, E, A>>
  }

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: {
    <_, A, B>(
      p: (i: I, a: A) => Option<B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, A>, p: (i: I, a: A) => Option<B>): Kind<F, _, B>
  }

  readonly filterWithIndex: {
    <_, A>(p: (i: I, a: A) => boolean): (self: Kind<F, _, A>) => Kind<F, _, A>
    <_, A>(self: Kind<F, _, A>, p: (i: I, a: A) => boolean): Kind<F, _, A>
  }
}

export const createFilterableWithIndex = <F extends HKT, I>(
  filterable: FunctorWithIndex<F, I> & Filterable<F>,
): FilterableWithIndex<F, I> => {
  const { compact, separate, mapWithIndex } = filterable

  const filterMapWithIndex: FilterableWithIndex<F, I>["filterMapWithIndex"] =
    overload (
      1,
      <_, A, B>(
        self: Kind<F, _, A>,
        p: (i: I, a: A) => Option<B>,
      ): Kind<F, _, B> => pipe (self, mapWithIndex (p), compact),
    )

  const filterWithIndex: FilterableWithIndex<F, I>["filterWithIndex"] =
    overload (
      1,
      <_, A>(self: Kind<F, _, A>, p: (i: I, a: A) => boolean): Kind<F, _, A> =>
        filterMapWithIndex (self, (i, a) => p (i, a) ? some (a) : none),
    )

  const partitionMapWithIndex: FilterableWithIndex<
    F,
    I
  >["partitionMapWithIndex"] = overload (
    1,
    <E, A, B, C>(
      self: Kind<F, E, A>,
      p: (i: I, a: A) => Either<B, C>,
    ): Separated<Kind<F, E, B>, Kind<F, E, C>> =>
      pipe (self, mapWithIndex (p), separate),
  )

  const partitionWithIndex: FilterableWithIndex<F, I>["partitionWithIndex"] =
    overload (
      1,
      <E, A>(
        self: Kind<F, E, A>,
        p: (i: I, a: A) => boolean,
      ): Separated<Kind<F, E, A>, Kind<F, E, A>> =>
        partitionMapWithIndex (self, (i, a) => p (i, a) ? right (a) : left (a)),
    )

  return {
    ...filterable,
    partitionMapWithIndex,
    partitionWithIndex,
    filterMapWithIndex,
    filterWithIndex,
  }
}
