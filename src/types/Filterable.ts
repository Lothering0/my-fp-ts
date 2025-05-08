import * as O from "../modules/option"
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
  filter: Filter<URI>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  filterMap: FilterMap<URI>
}

export interface Filterable2<URI extends URIS2>
  extends Functor2<URI>,
    Compactable2<URI> {
  filter: Filter2<URI>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  filterMap: FilterMap2<URI>
}

export const createFilterable = <URI extends URIS>(
  filterable: Functor<URI> & Compactable<URI>,
): Filterable<URI> => {
  const { compact, map } = filterable

  const filterPointed: FilterPointed<URI> = (fa, p) =>
    pipe (
      fa,
      map (a => p (a) ? O.some (a) : O.none),
      compact,
    )

  const filterMapPointed: FilterMapPointed<URI> = (fa, p) =>
    pipe (fa, map (p), compact)

  return {
    ...filterable,
    filter: overloadWithPointFree (filterPointed),
    filterMap: overloadWithPointFree (filterMapPointed),
  }
}

type CreateFilterable2 = <URI extends URIS2>(
  filterable: Functor2<URI> & Compactable2<URI>,
) => Filterable2<URI>
export const createFilterable2: CreateFilterable2 =
  createFilterable as CreateFilterable2

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
