import { HKT, HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface TapIo2C<URI extends URIS2, E>
  extends TapIo2CPointed<URI, E>,
    TapIo2CPointFree<URI, E> {}

export interface TapIo2CPointed<URI extends URIS2, _> {
  <A, _2>(ma: HKT2<URI, _, A>, f: (a: A) => HKT<"Io", _2>): HKT2<URI, _, A>
}

export interface TapIo2CPointFree<URI extends URIS2, _> {
  <A, _2>(f: (a: A) => HKT<"Io", _2>): (ma: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
