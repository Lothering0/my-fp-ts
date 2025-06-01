import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FlatMap2C<URI extends URIS2, E>
  extends FlatMap2CPointed<URI, E>,
    FlatMap2CPointFree<URI, E> {}

export interface FlatMap2CPointed<URI extends URIS2, _> {
  <A, B>(ma: HKT2<URI, _, A>, f: (a: A) => HKT2<URI, _, B>): HKT2<URI, _, B>
}

export interface FlatMap2CPointFree<URI extends URIS2, _> {
  <A, B>(f: (a: A) => HKT2<URI, _, B>): (ma: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
