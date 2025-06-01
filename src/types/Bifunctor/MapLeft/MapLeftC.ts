import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface MapLeftC<URI extends URIS2, E>
  extends MapLeftCPointed<URI, E>,
    MapLeftCPointFree<URI, E> {}

export interface MapLeftCPointed<URI extends URIS2, E> {
  <_, D>(fe: HKT2<URI, E, _>, f: (e: E) => D): HKT2<URI, D, _>
}

export interface MapLeftCPointFree<URI extends URIS2, E> {
  <_, D>(f: (e: E) => D): (fe: HKT2<URI, E, _>) => HKT2<URI, D, _>
}
