import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface TapIo<URI extends URIS>
  extends TapIoPointed<URI>,
    TapIoPointFree<URI> {}

export interface TapIoPointed<URI extends URIS> {
  <A, _>(ma: HKT<URI, A>, f: (a: A) => HKT<"IO", _>): HKT<URI, A>
}

export interface TapIoPointFree<URI extends URIS> {
  <A, _>(f: (a: A) => HKT<"IO", _>): (ma: HKT<URI, A>) => HKT<URI, A>
}
