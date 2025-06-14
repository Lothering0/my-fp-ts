import { Kind2, URIS2 } from "../../Kind"

export interface Bimap<URI extends URIS2>
  extends BimapPointed<URI>,
    BimapPointFree<URI> {}

export interface BimapPointed<URI extends URIS2> {
  <E, A, D, B>(
    fa: Kind2<URI, E, A>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): Kind2<URI, D, B>
}

export interface BimapPointFree<URI extends URIS2> {
  <E, A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: Kind2<URI, E, A>) => Kind2<URI, D, B>
}
