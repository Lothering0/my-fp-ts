import { URIS, Kind } from "../../Kind"

export interface TapIo<URI extends URIS>
  extends TapIoPointed<URI>,
    TapIoPointFree<URI> {}

export interface TapIoPointed<URI extends URIS> {
  <A, _>(ma: Kind<URI, A>, f: (a: A) => Kind<"Io", _>): Kind<URI, A>
}

export interface TapIoPointFree<URI extends URIS> {
  <A, _>(f: (a: A) => Kind<"Io", _>): (ma: Kind<URI, A>) => Kind<URI, A>
}
