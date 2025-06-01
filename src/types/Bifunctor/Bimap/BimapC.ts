import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface BimapC<URI extends URIS2, E>
  extends BimapCPointed<URI, E>,
    BimapCPointFree<URI, E> {}

export interface BimapCPointed<URI extends URIS2, E> {
  <A, D, B>(
    fa: HKT2<URI, E, A>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): HKT2<URI, D, B>
}

export interface BimapCPointFree<URI extends URIS2, E> {
  <A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, D, B>
}
