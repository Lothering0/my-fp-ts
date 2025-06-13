import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Ap2C<URI extends URIS2, E>
  extends Ap2CPointed<URI, E>,
    Ap2CPointFree<URI, E> {}

export interface Ap2CPointed<URI extends URIS2, _> {
  <A, B>(ff: HKT2<URI, _, (a: A) => B>, fa: HKT2<URI, _, A>): HKT2<URI, _, B>
}

export interface Ap2CPointFree<URI extends URIS2, _> {
  <A, B>(
    fa: HKT2<URI, _, A>,
  ): (ff: HKT2<URI, _, (a: A) => B>) => HKT2<URI, _, B>
}
