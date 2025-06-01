import { HKT, HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface TapIo2<URI extends URIS2>
  extends TapIo2Pointed<URI>,
    TapIo2PointFree<URI> {}

export interface TapIo2Pointed<URI extends URIS2> {
  <_, A, _2>(ma: HKT2<URI, _, A>, f: (a: A) => HKT<"IO", _2>): HKT2<URI, _, A>
}

export interface TapIo2PointFree<URI extends URIS2> {
  <_, A, _2>(
    f: (a: A) => HKT<"IO", _2>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
