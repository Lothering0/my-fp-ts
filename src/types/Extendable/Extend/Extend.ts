import { Kind, URIS } from "../../Kind"

export interface Extend<URI extends URIS>
  extends ExtendPointed<URI>,
    ExtendPointFree<URI> {}

export interface ExtendPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, f: (fa: Kind<URI, A>) => B): Kind<URI, B>
}

export interface ExtendPointFree<URI extends URIS> {
  <A, B>(f: (fa: Kind<URI, A>) => B): (fa: Kind<URI, A>) => Kind<URI, B>
}
