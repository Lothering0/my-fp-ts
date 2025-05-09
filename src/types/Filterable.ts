import * as O from "../modules/option"
import * as E from "../modules/either"
import * as S from "../modules/separated"
import { Predicate } from "src/modules/predicate"
import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { Compactable, Compactable2 } from "./Compactable"
import { overloadWithPointFree } from "src/utils/points"
import { pipe } from "../utils/pipe"

export interface Filterable<URI extends URIS>
  extends Functor<URI>,
    Compactable<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: PartitionMap<URI>
  readonly partition: Partition<URI>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: FilterMap<URI>
  readonly filter: Filter<URI>
}

export interface Filterable2<URI extends URIS2>
  extends Functor2<URI>,
    Compactable2<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: PartitionMap2<URI>
  readonly partition: Partition2<URI>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: FilterMap2<URI>
  readonly filter: Filter2<URI>
}

export const createFilterable = <URI extends URIS>(
  filterable: Functor<URI> & Compactable<URI>,
): Filterable<URI> => {
  const { compact, separate, map } = filterable

  const filterMapPointed: FilterMapPointed<URI> = (fa, p) =>
    pipe (fa, map (p), compact)

  const filterPointed: FilterPointed<URI> = (fa, p) =>
    filterMapPointed (fa, a => p (a) ? O.some (a) : O.none)

  const partitionMapPointed: PartitionMapPointed<URI> = (fa, p) =>
    pipe (fa, map (p), separate)

  const partitionPointed: PartitionPointed<URI> = (fa, p) =>
    partitionMapPointed (fa, a => p (a) ? E.right (a) : E.left (a))

  return {
    ...filterable,
    partitionMap: overloadWithPointFree (partitionMapPointed),
    partition: overloadWithPointFree (partitionPointed),
    filterMap: overloadWithPointFree (filterMapPointed),
    filter: overloadWithPointFree (filterPointed),
  }
}

type CreateFilterable2 = <URI extends URIS2>(
  filterable: Functor2<URI> & Compactable2<URI>,
) => Filterable2<URI>
export const createFilterable2: CreateFilterable2 =
  createFilterable as CreateFilterable2

interface PartitionMapPointed<URI extends URIS> {
  <A, B, C>(
    fa: HKT<URI, A>,
    p: (a: A) => E.Either<B, C>,
  ): S.Separated<HKT<URI, B>, HKT<URI, C>>
}

interface PartitionMapPointed2<URI extends URIS2> {
  <E, A, B, C>(
    fa: HKT2<URI, E, A>,
    p: (a: A) => E.Either<B, C>,
  ): S.Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

interface PartitionMap<URI extends URIS> extends PartitionMapPointed<URI> {
  <A, B, C>(
    p: (a: A) => E.Either<B, C>,
  ): (fa: HKT<URI, A>) => S.Separated<HKT<URI, B>, HKT<URI, C>>
}

interface PartitionMap2<URI extends URIS2> extends PartitionMapPointed2<URI> {
  <E, A, B, C>(
    p: (a: A) => E.Either<B, C>,
  ): (fa: HKT2<URI, E, A>) => S.Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

interface PartitionPointed<URI extends URIS> {
  <A>(fa: HKT<URI, A>, p: Predicate<A>): S.Separated<HKT<URI, A>, HKT<URI, A>>
}

interface PartitionPointed2<URI extends URIS2> {
  <E, A>(
    fa: HKT2<URI, E, A>,
    p: Predicate<A>,
  ): S.Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

interface Partition<URI extends URIS> extends PartitionPointed<URI> {
  <A>(
    p: Predicate<A>,
  ): (fa: HKT<URI, A>) => S.Separated<HKT<URI, A>, HKT<URI, A>>
}

interface Partition2<URI extends URIS2> extends PartitionPointed2<URI> {
  <E, A>(
    p: Predicate<A>,
  ): (fa: HKT2<URI, E, A>) => S.Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

interface FilterMapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, p: (a: A) => O.Option<B>): HKT<URI, B>
}

interface FilterMapPointed2<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, p: (a: A) => O.Option<B>): HKT2<URI, _, B>
}

interface FilterMap<URI extends URIS> extends FilterMapPointed<URI> {
  <A, B>(p: (a: A) => O.Option<B>): (fa: HKT<URI, A>) => HKT<URI, B>
}

interface FilterMap2<URI extends URIS2> extends FilterMapPointed2<URI> {
  <_, A, B>(p: (a: A) => O.Option<B>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}

interface FilterPointed<URI extends URIS> {
  <A>(fa: HKT<URI, A>, p: Predicate<A>): HKT<URI, A>
}

interface FilterPointed2<URI extends URIS2> {
  <_, A>(fa: HKT2<URI, _, A>, p: Predicate<A>): HKT2<URI, _, A>
}

interface Filter<URI extends URIS> extends FilterPointed<URI> {
  <A>(p: Predicate<A>): (fa: HKT<URI, A>) => HKT<URI, A>
}

interface Filter2<URI extends URIS2> extends FilterPointed2<URI> {
  <_, A>(p: Predicate<A>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
