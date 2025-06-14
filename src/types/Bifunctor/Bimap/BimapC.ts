import { Kind2, URIS2 } from "../../Kind"

export interface BimapC<URI extends URIS2, E>
  extends BimapCPointed<URI, E>,
    BimapCPointFree<URI, E> {}

export interface BimapCPointed<URI extends URIS2, E> {
  <A, D, B>(
    fa: Kind2<URI, E, A>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): Kind2<URI, D, B>
}

export interface BimapCPointFree<URI extends URIS2, E> {
  <A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: Kind2<URI, E, A>) => Kind2<URI, D, B>
}
