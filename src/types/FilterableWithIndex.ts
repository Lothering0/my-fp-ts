import { Separated } from "../modules/Separated"
import { Option, some, none } from "../modules/Option"
import { Result, failure, success } from "../modules/Result"
import { HKT, Kind } from "./HKT"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { Filterable } from "./Filterable"
import { pipe } from "../utils/flow"
import { overload } from "../utils/overloads"

export interface FilterableWithIndex<F extends HKT, I>
  extends FunctorWithIndex<F, I>,
    Filterable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: {
    <_, E, A, B, C>(
      p: (i: I, a: A) => Result<B, C>,
    ): (self: Kind<F, _, E, A>) => Separated<Kind<F, _, E, B>, Kind<F, _, E, C>>
    <_, E, A, B, C>(
      self: Kind<F, _, E, A>,
      p: (i: I, a: A) => Result<B, C>,
    ): Separated<Kind<F, _, E, B>, Kind<F, _, E, C>>
  }

  readonly partitionWithIndex: {
    <_, E, A>(
      p: (i: I, a: A) => boolean,
    ): (self: Kind<F, _, E, A>) => Separated<Kind<F, _, E, A>, Kind<F, _, E, A>>
    <_, E, A>(
      self: Kind<F, _, E, A>,
      p: (i: I, a: A) => boolean,
    ): Separated<Kind<F, _, E, A>, Kind<F, _, E, A>>
  }

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: {
    <_, _2, A, B>(
      p: (i: I, a: A) => Option<B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      p: (i: I, a: A) => Option<B>,
    ): Kind<F, _, _2, B>
  }

  readonly filterWithIndex: {
    <_, _2, A>(
      p: (i: I, a: A) => boolean,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, A>
    <_, _2, A>(
      self: Kind<F, _, _2, A>,
      p: (i: I, a: A) => boolean,
    ): Kind<F, _, _2, A>
  }
}

export const createFilterableWithIndex = <F extends HKT, I>(
  Filterable: FunctorWithIndex<F, I> & Filterable<F>,
): FilterableWithIndex<F, I> => {
  const { compact, separate, mapWithIndex } = Filterable

  const filterMapWithIndex: FilterableWithIndex<F, I>["filterMapWithIndex"] =
    overload (
      1,
      <_, _2, A, B>(
        self: Kind<F, _, _2, A>,
        p: (i: I, a: A) => Option<B>,
      ): Kind<F, _, _2, B> => pipe (self, mapWithIndex (p), compact),
    )

  const filterWithIndex: FilterableWithIndex<F, I>["filterWithIndex"] =
    overload (
      1,
      <_, _2, A>(
        self: Kind<F, _, _2, A>,
        p: (i: I, a: A) => boolean,
      ): Kind<F, _, _2, A> =>
        filterMapWithIndex (self, (i, a) => p (i, a) ? some (a) : none),
    )

  const partitionMapWithIndex: FilterableWithIndex<
    F,
    I
  >["partitionMapWithIndex"] = overload (
    1,
    <_, E, A, B, C>(
      self: Kind<F, _, E, A>,
      p: (i: I, a: A) => Result<B, C>,
    ): Separated<Kind<F, _, E, B>, Kind<F, _, E, C>> =>
      pipe (self, mapWithIndex (p), separate),
  )

  const partitionWithIndex: FilterableWithIndex<F, I>["partitionWithIndex"] =
    overload (
      1,
      <_, E, A>(
        self: Kind<F, _, E, A>,
        p: (i: I, a: A) => boolean,
      ): Separated<Kind<F, _, E, A>, Kind<F, _, E, A>> =>
        partitionMapWithIndex (self, (i, a) =>
          p (i, a) ? success (a) : failure (a),
        ),
    )

  return {
    ...Filterable,
    partitionMapWithIndex,
    partitionWithIndex,
    filterMapWithIndex,
    filterWithIndex,
  }
}
