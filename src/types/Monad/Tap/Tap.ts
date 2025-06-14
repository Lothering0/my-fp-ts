import { URIS, Kind } from "../../Kind"

export interface Tap<URI extends URIS>
  extends TapPointed<URI>,
    TapPointFree<URI> {}

export interface TapPointed<URI extends URIS> {
  <A, _>(ma: Kind<URI, A>, f: (a: A) => Kind<URI, _>): Kind<URI, A>
}

export interface TapPointFree<URI extends URIS> {
  <A, _>(f: (a: A) => Kind<URI, _>): (ma: Kind<URI, A>) => Kind<URI, A>
}
