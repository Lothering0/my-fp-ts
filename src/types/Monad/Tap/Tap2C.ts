import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Tap2C<URI extends URIS2, E>
  extends Tap2CPointed<URI, E>,
    Tap2CPointFree<URI, E> {}

export interface Tap2CPointed<URI extends URIS2, _> {
  <A, _2>(ma: HKT2<URI, _, A>, f: (a: A) => HKT2<URI, _, _2>): HKT2<URI, _, A>
}

export interface Tap2CPointFree<URI extends URIS2, _> {
  <A, _2>(
    f: (a: A) => HKT2<URI, _, _2>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
