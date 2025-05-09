import * as O from "../modules/option"
import * as E from "../modules/either"
import * as S from "../modules/separated"
import { FunctorWithIndex, FunctorWithIndex2 } from "./FunctorWithIndex"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "src/utils/points"
import { Filterable, Filterable2 } from "./Filterable"
import { pipe } from "../utils/pipe"

export interface FilterableWithIndex<URI extends URIS, I>
  extends FunctorWithIndex<URI, I>,
    Filterable<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: PartitionMapWithIndex<URI, I>
  readonly partitionWithIndex: PartitionWithIndex<URI, I>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: FilterMapWithIndex<URI, I>
  readonly filterWithIndex: FilterWithIndex<URI, I>
}

export interface FilterableWithIndex2<URI extends URIS2, I>
  extends FunctorWithIndex2<URI, I>,
    Filterable2<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: PartitionMapWithIndex2<URI, I>
  readonly partitionWithIndex: PartitionWithIndex2<URI, I>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: FilterMapWithIndex2<URI, I>
  readonly filterWithIndex: FilterWithIndex2<URI, I>
}

export const createFilterableWithIndex = <URI extends URIS, I>(
  filterable: FunctorWithIndex<URI, I> & Filterable<URI>,
): FilterableWithIndex<URI, I> => {
  const { compact, separate, mapWithIndex } = filterable

  const filterMapWithIndexPointed: FilterMapWithIndexPointed<URI, I> = (
    fa,
    p,
  ) => pipe (fa, mapWithIndex (p), compact)

  const filterWithIndexPointed: FilterWithIndexPointed<URI, I> = (fa, p) =>
    filterMapWithIndexPointed (fa, (i, a) => p (i, a) ? O.some (a) : O.none)

  const partitionMapWithIndexPointed: PartitionMapWithIndexPointed<URI, I> = (
    fa,
    p,
  ) => pipe (fa, mapWithIndex (p), separate)

  const partitionWithIndexPointed: PartitionWithIndexPointed<URI, I> = (
    fa,
    p,
  ) =>
    partitionMapWithIndexPointed (fa, (i, a) =>
      p (i, a) ? E.right (a) : E.left (a),
    )

  return {
    ...filterable,
    partitionMapWithIndex: overloadWithPointFree (partitionMapWithIndexPointed),
    partitionWithIndex: overloadWithPointFree (partitionWithIndexPointed),
    filterMapWithIndex: overloadWithPointFree (filterMapWithIndexPointed),
    filterWithIndex: overloadWithPointFree (filterWithIndexPointed),
  }
}

type CreateFilterableWithIndex2 = <URI extends URIS2, I>(
  filterable: FunctorWithIndex2<URI, I> & Filterable2<URI>,
) => FilterableWithIndex2<URI, I>
export const createFilterableWithIndex2: CreateFilterableWithIndex2 =
  createFilterableWithIndex as CreateFilterableWithIndex2

interface PartitionMapWithIndexPointed<URI extends URIS, I> {
  <A, B, C>(
    fa: HKT<URI, A>,
    p: (i: I, a: A) => E.Either<B, C>,
  ): S.Separated<HKT<URI, B>, HKT<URI, C>>
}

interface PartitionMapWithIndexPointed2<URI extends URIS2, I> {
  <E, A, B, C>(
    fa: HKT2<URI, E, A>,
    p: (i: I, a: A) => E.Either<B, C>,
  ): S.Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

interface PartitionMapWithIndex<URI extends URIS, I>
  extends PartitionMapWithIndexPointed<URI, I> {
  <A, B, C>(
    p: (i: I, a: A) => E.Either<B, C>,
  ): (fa: HKT<URI, A>) => S.Separated<HKT<URI, B>, HKT<URI, C>>
}

interface PartitionMapWithIndex2<URI extends URIS2, I>
  extends PartitionMapWithIndexPointed2<URI, I> {
  <E, A, B, C>(
    p: (i: I, a: A) => E.Either<B, C>,
  ): (fa: HKT2<URI, E, A>) => S.Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

interface PartitionWithIndexPointed<URI extends URIS, I> {
  <A>(
    fa: HKT<URI, A>,
    p: (i: I, a: A) => boolean,
  ): S.Separated<HKT<URI, A>, HKT<URI, A>>
}

interface PartitionWithIndexPointed2<URI extends URIS2, I> {
  <E, A>(
    fa: HKT2<URI, E, A>,
    p: (i: I, a: A) => boolean,
  ): S.Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

interface PartitionWithIndex<URI extends URIS, I>
  extends PartitionWithIndexPointed<URI, I> {
  <A>(
    p: (i: I, a: A) => boolean,
  ): (fa: HKT<URI, A>) => S.Separated<HKT<URI, A>, HKT<URI, A>>
}

interface PartitionWithIndex2<URI extends URIS2, I>
  extends PartitionWithIndexPointed2<URI, I> {
  <E, A>(
    p: (i: I, a: A) => boolean,
  ): (fa: HKT2<URI, E, A>) => S.Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

interface FilterMapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, p: (i: I, a: A) => O.Option<B>): HKT<URI, B>
}

interface FilterMapWithIndexPointed2<URI extends URIS2, I> {
  <_, A, B>(
    fa: HKT2<URI, _, A>,
    p: (i: I, a: A) => O.Option<B>,
  ): HKT2<URI, _, B>
}

interface FilterMapWithIndex<URI extends URIS, I>
  extends FilterMapWithIndexPointed<URI, I> {
  <A, B>(p: (i: I, a: A) => O.Option<B>): (fa: HKT<URI, A>) => HKT<URI, B>
}

interface FilterMapWithIndex2<URI extends URIS2, I>
  extends FilterMapWithIndexPointed2<URI, I> {
  <_, A, B>(
    p: (i: I, a: A) => O.Option<B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}

interface FilterWithIndexPointed<URI extends URIS, I> {
  <A>(fa: HKT<URI, A>, p: (i: I, a: A) => boolean): HKT<URI, A>
}

interface FilterWithIndexPointed2<URI extends URIS2, I> {
  <_, A>(fa: HKT2<URI, _, A>, p: (i: I, a: A) => boolean): HKT2<URI, _, A>
}

interface FilterWithIndex<URI extends URIS, I>
  extends FilterWithIndexPointed<URI, I> {
  <A>(p: (i: I, a: A) => boolean): (fa: HKT<URI, A>) => HKT<URI, A>
}

interface FilterWithIndex2<URI extends URIS2, I>
  extends FilterWithIndexPointed2<URI, I> {
  <_, A>(p: (i: I, a: A) => boolean): (fa: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
