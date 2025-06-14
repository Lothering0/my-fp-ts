import { URIS, Kind } from "../../Kind"

export interface Compose<URI extends URIS>
  extends ComposePointed<URI>,
    ComposePointFree<URI> {}

export interface ComposePointed<URI extends URIS> {
  <A, B, C>(
    g: (b: B) => Kind<URI, C>,
    f: (a: A) => Kind<URI, B>,
    a: A,
  ): Kind<URI, C>
}

export interface ComposePointFree<URI extends URIS> {
  <A, B, C>(
    g: (b: B) => Kind<URI, C>,
    f: (a: A) => Kind<URI, B>,
  ): (a: A) => Kind<URI, C>
}
