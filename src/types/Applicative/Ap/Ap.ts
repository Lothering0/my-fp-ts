import { Kind, URIS } from "../../Kind"

export interface Ap<URI extends URIS>
  extends ApPointed<URI>,
    ApPointFree<URI> {}

export interface ApPointed<URI extends URIS> {
  <A, B>(ff: Kind<URI, (a: A) => B>, fa: Kind<URI, A>): Kind<URI, B>
}

export interface ApPointFree<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>): (ff: Kind<URI, (a: A) => B>) => Kind<URI, B>
}
