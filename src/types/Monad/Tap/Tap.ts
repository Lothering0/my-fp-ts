import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Tap<URI extends URIS>
  extends TapPointed<URI>,
    TapPointFree<URI> {}

export interface TapPointed<URI extends URIS> {
  <A, _>(ma: HKT<URI, A>, f: (a: A) => HKT<URI, _>): HKT<URI, A>
}

export interface TapPointFree<URI extends URIS> {
  <A, _>(f: (a: A) => HKT<URI, _>): (ma: HKT<URI, A>) => HKT<URI, A>
}
