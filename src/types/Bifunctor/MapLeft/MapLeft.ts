import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface MapLeft<URI extends URIS2>
  extends MapLeftPointed<URI>,
    MapLeftPointFree<URI> {}

export interface MapLeftPointed<URI extends URIS2> {
  <E, _, D>(fe: HKT2<URI, E, _>, f: (e: E) => D): HKT2<URI, D, _>
}

export interface MapLeftPointFree<URI extends URIS2> {
  <E, _, D>(f: (e: E) => D): (fe: HKT2<URI, E, _>) => HKT2<URI, D, _>
}
