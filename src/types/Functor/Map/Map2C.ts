import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Map2C<URI extends URIS2, E>
  extends Map2CPointed<URI, E>,
    Map2CPointFree<URI, E> {}

export interface Map2CPointed<URI extends URIS2, _> {
  <A, B>(fa: HKT2<URI, _, A>, f: (a: A) => B): HKT2<URI, _, B>
}

export interface Map2CPointFree<URI extends URIS2, _> {
  <A, B>(f: (a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
