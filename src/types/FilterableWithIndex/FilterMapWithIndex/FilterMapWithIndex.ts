import { Option } from "../../../modules/Option"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface FilterMapWithIndex<URI extends URIS, I>
  extends FilterMapWithIndexPointed<URI, I>,
    FilterMapWithIndexPointFree<URI, I> {}

export interface FilterMapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, p: (i: I, a: A) => Option<B>): HKT<URI, B>
}

export interface FilterMapWithIndexPointFree<URI extends URIS, I> {
  <A, B>(p: (i: I, a: A) => Option<B>): (fa: HKT<URI, A>) => HKT<URI, B>
}
