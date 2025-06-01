import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Bimap<URI extends URIS2>
  extends BimapPointed<URI>,
    BimapPointFree<URI> {}

export interface BimapPointed<URI extends URIS2> {
  <E, A, D, B>(
    fa: HKT2<URI, E, A>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): HKT2<URI, D, B>
}

export interface BimapPointFree<URI extends URIS2> {
  <E, A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, D, B>
}
