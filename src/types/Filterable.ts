import { Separated } from "../modules/Separated"
import { Option, some, none } from "../modules/Option"
import { Either, left, right } from "../modules/Either"
import { Compactable } from "./Compactable"
import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"
import { Predicate } from "../modules/Predicate"
import { overload } from "src/utils/overloads"
import { pipe } from "src/utils/flow"

export interface Filterable<F extends HKT> extends Functor<F>, Compactable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: {
    <E, A, B, C>(
      p: (a: A) => Either<B, C>,
    ): (self: Kind<F, E, A>) => Separated<Kind<F, E, B>, Kind<F, E, C>>
    <E, A, B, C>(
      self: Kind<F, E, A>,
      p: (a: A) => Either<B, C>,
    ): Separated<Kind<F, E, B>, Kind<F, E, C>>
  }

  readonly partition: {
    <E, A>(
      p: Predicate<A>,
    ): (self: Kind<F, E, A>) => Separated<Kind<F, E, A>, Kind<F, E, A>>
    <E, A>(
      self: Kind<F, E, A>,
      p: Predicate<A>,
    ): Separated<Kind<F, E, A>, Kind<F, E, A>>
  }

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: {
    <_, A, B>(p: (a: A) => Option<B>): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, A>, p: (a: A) => Option<B>): Kind<F, _, B>
  }

  readonly filter: {
    <_, A>(p: Predicate<A>): (self: Kind<F, _, A>) => Kind<F, _, A>
    <_, A>(self: Kind<F, _, A>, p: Predicate<A>): Kind<F, _, A>
  }
}

export const createFilterable = <F extends HKT>(
  filterable: Functor<F> & Compactable<F>,
): Filterable<F> => {
  const { compact, separate, map } = filterable

  const filterMap: Filterable<F>["filterMap"] = overload (
    1,
    <_, A, B>(self: Kind<F, _, A>, p: (a: A) => Option<B>): Kind<F, _, B> =>
      pipe (self, map (p), compact),
  )

  const filter: Filterable<F>["filter"] = overload (
    1,
    <_, A>(self: Kind<F, _, A>, p: Predicate<A>): Kind<F, _, A> =>
      filterMap (self, a => p (a) ? some (a) : none),
  )

  const partitionMap: Filterable<F>["partitionMap"] = overload (
    1,
    <E, A, B, C>(
      self: Kind<F, E, A>,
      p: (a: A) => Either<B, C>,
    ): Separated<Kind<F, E, B>, Kind<F, E, C>> => pipe (self, map (p), separate),
  )

  const partition: Filterable<F>["partition"] = overload (
    1,
    <E, A>(
      self: Kind<F, E, A>,
      p: Predicate<A>,
    ): Separated<Kind<F, E, A>, Kind<F, E, A>> =>
      partitionMap (self, a => p (a) ? right (a) : left (a)),
  )

  return {
    ...filterable,
    partitionMap,
    partition,
    filterMap,
    filter,
  }
}
