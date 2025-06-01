import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Compose<URI extends URIS>
  extends ComposePointed<URI>,
    ComposePointFree<URI> {}

export interface ComposePointed<URI extends URIS> {
  <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
    a: A,
  ): HKT<URI, C>
}

export interface ComposePointFree<URI extends URIS> {
  <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
  ): (a: A) => HKT<URI, C>
}
