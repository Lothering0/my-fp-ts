import * as O from "../modules/option"
import { FunctorWithIndex, FunctorWithIndex2 } from "./FunctorWithIndex"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "src/utils/points"
import { Filterable, Filterable2 } from "./Filterable"
import { pipe } from "../utils/pipe"

export interface FilterableWithIndex<URI extends URIS, I>
  extends FunctorWithIndex<URI, I>,
    Filterable<URI> {
  filterWithIndex: FilterWithIndex<URI, I>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  filterMapWithIndex: FilterMapWithIndex<URI, I>
}

export interface FilterableWithIndex2<URI extends URIS2, I>
  extends FunctorWithIndex2<URI, I>,
    Filterable2<URI> {
  filterWithIndex: FilterWithIndex2<URI, I>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  filterMapWithIndex: FilterMapWithIndex2<URI, I>
}

export const createFilterableWithIndex = <URI extends URIS, I>(
  filterable: FunctorWithIndex<URI, I> & Filterable<URI>,
): FilterableWithIndex<URI, I> => {
  const { compact, mapWithIndex } = filterable

  const filterWithIndexPointed: FilterWithIndexPointed<URI, I> = (fa, p) =>
    pipe (
      fa,
      mapWithIndex ((i, a) => p (i, a) ? O.some (a) : O.none),
      compact,
    )

  const filterMapWithIndexPointed: FilterMapWithIndexPointed<URI, I> = (
    fa,
    p,
  ) => pipe (fa, mapWithIndex (p), compact)

  return {
    ...filterable,
    filterWithIndex: overloadWithPointFree (filterWithIndexPointed),
    filterMapWithIndex: overloadWithPointFree (filterMapWithIndexPointed),
  }
}

type CreateFilterableWithIndex2 = <URI extends URIS2, I>(
  filterable: FunctorWithIndex2<URI, I> & Filterable2<URI>,
) => FilterableWithIndex2<URI, I>
export const createFilterableWithIndex2: CreateFilterableWithIndex2 =
  createFilterableWithIndex as CreateFilterableWithIndex2

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
