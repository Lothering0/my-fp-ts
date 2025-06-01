import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FilterWithIndex2C<URI extends URIS2, I, E>
  extends FilterWithIndex2CPointed<URI, I, E>,
    FilterWithIndex2CPointFree<URI, I, E> {}

export interface FilterWithIndex2CPointed<URI extends URIS2, I, _> {
  <A>(fa: HKT2<URI, _, A>, p: (i: I, a: A) => boolean): HKT2<URI, _, A>
}

export interface FilterWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A>(p: (i: I, a: A) => boolean): (fa: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
