import { Separated } from "../modules/Separated"
import { Option, some, none } from "../modules/Option"
import { Result, fail, succeed } from "../modules/Result"
import { Compactable } from "./Compactable"
import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"
import { Predicate } from "../modules/Predicate"
import { flow } from "../utils/flow"

export interface Filterable<F extends HKT> extends Functor<F>, Compactable<F> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: <A, B, C>(
    p: (a: A) => Result<B, C>,
  ) => <S, E>(
    self: Kind<F, S, E, A>,
  ) => Separated<Kind<F, S, E, B>, Kind<F, S, E, C>>

  readonly partition: <A>(
    p: Predicate<A>,
  ) => <S, E>(
    self: Kind<F, S, E, A>,
  ) => Separated<Kind<F, S, E, A>, Kind<F, S, E, A>>

  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: <A, B>(
    p: (a: A) => Option<B>,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, B>

  readonly filter: {
    <A>(p: Predicate<A>): <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, A>
  }
}

export const createFilterable = <F extends HKT>(
  Filterable: Functor<F> & Compactable<F>,
): Filterable<F> => {
  const { compact, separate, map } = Filterable

  const filterMap: Filterable<F>["filterMap"] = p => flow (map (p), compact)

  const filter: Filterable<F>["filter"] = p =>
    filterMap (a => p (a) ? some (a) : none)

  const partitionMap: Filterable<F>["partitionMap"] = p =>
    flow (map (p), separate)

  const partition: Filterable<F>["partition"] = p =>
    partitionMap (a => p (a) ? succeed (a) : fail (a))

  return {
    ...Filterable,
    partitionMap,
    partition,
    filterMap,
    filter,
  }
}
