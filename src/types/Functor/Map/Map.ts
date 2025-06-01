import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Map<URI extends URIS>
  extends MapPointed<URI>,
    MapPointFree<URI> {}

export interface MapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, f: (a: A) => B): HKT<URI, B>
}

export interface MapPointFree<URI extends URIS> {
  <A, B>(f: (a: A) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}
