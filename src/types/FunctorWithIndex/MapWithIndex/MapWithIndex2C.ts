import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface MapWithIndex2C<URI extends URIS2, I, E>
  extends MapWithIndex2CPointed<URI, I, E>,
    MapWithIndex2CPointFree<URI, I, E> {}

export interface MapWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(fa: HKT2<URI, _, A>, f: (i: I, a: A) => B): HKT2<URI, _, B>
}

export interface MapWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(f: (i: I, a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
