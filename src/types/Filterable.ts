import { Separated } from "../modules/Separated"
import { Option, some, none } from "../modules/Option"
import { Result, failure, success } from "../modules/Result"
import { Compactable } from "./Compactable"
import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"
import { Predicate } from "../modules/Predicate"
import { overload } from "src/utils/overloads"
import { pipe } from "src/utils/flow"

export interface Filterable<F extends HKT> extends Functor<F>, Compactable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: {
    <_, E, A, B, C>(
      p: (a: A) => Result<B, C>,
    ): (self: Kind<F, _, E, A>) => Separated<Kind<F, _, E, B>, Kind<F, _, E, C>>
    <_, E, A, B, C>(
      self: Kind<F, _, E, A>,
      p: (a: A) => Result<B, C>,
    ): Separated<Kind<F, _, E, B>, Kind<F, _, E, C>>
  }

  readonly partition: {
    <_, E, A>(
      p: Predicate<A>,
    ): (self: Kind<F, _, E, A>) => Separated<Kind<F, _, E, A>, Kind<F, _, E, A>>
    <_, E, A>(
      self: Kind<F, _, E, A>,
      p: Predicate<A>,
    ): Separated<Kind<F, _, E, A>, Kind<F, _, E, A>>
  }

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: {
    <_, _2, A, B>(
      p: (a: A) => Option<B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      p: (a: A) => Option<B>,
    ): Kind<F, _, _2, B>
  }

  readonly filter: {
    <_, _2, A>(p: Predicate<A>): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, A>
    <_, _2, A>(self: Kind<F, _, _2, A>, p: Predicate<A>): Kind<F, _, _2, A>
  }
}

export const createFilterable = <F extends HKT>(
  filterable: Functor<F> & Compactable<F>,
): Filterable<F> => {
  const { compact, separate, map } = filterable

  const filterMap: Filterable<F>["filterMap"] = overload (
    1,
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      p: (a: A) => Option<B>,
    ): Kind<F, _, _2, B> => pipe (self, map (p), compact),
  )

  const filter: Filterable<F>["filter"] = overload (
    1,
    <_, _2, A>(self: Kind<F, _, _2, A>, p: Predicate<A>): Kind<F, _, _2, A> =>
      filterMap (self, a => p (a) ? some (a) : none),
  )

  const partitionMap: Filterable<F>["partitionMap"] = overload (
    1,
    <_, E, A, B, C>(
      self: Kind<F, _, E, A>,
      p: (a: A) => Result<B, C>,
    ): Separated<Kind<F, _, E, B>, Kind<F, _, E, C>> =>
      pipe (self, map (p), separate),
  )

  const partition: Filterable<F>["partition"] = overload (
    1,
    <_, E, A>(
      self: Kind<F, _, E, A>,
      p: Predicate<A>,
    ): Separated<Kind<F, _, E, A>, Kind<F, _, E, A>> =>
      partitionMap (self, a => p (a) ? success (a) : failure (a)),
  )

  return {
    ...filterable,
    partitionMap,
    partition,
    filterMap,
    filter,
  }
}
