import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface FilterWithIndex<URI extends URIS, I>
  extends FilterWithIndexPointed<URI, I>,
    FilterWithIndexPointFree<URI, I> {}

export interface FilterWithIndexPointed<URI extends URIS, I> {
  <A>(fa: HKT<URI, A>, p: (i: I, a: A) => boolean): HKT<URI, A>
}

export interface FilterWithIndexPointFree<URI extends URIS, I> {
  <A>(p: (i: I, a: A) => boolean): (fa: HKT<URI, A>) => HKT<URI, A>
}
