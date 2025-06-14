import { Kind, URIS } from "../../Kind"

export interface Apply<URI extends URIS>
  extends ApplyPointed<URI>,
    ApplyPointFree<URI> {}

export interface ApplyPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, ff: Kind<URI, (a: A) => B>): Kind<URI, B>
}

export interface ApplyPointFree<URI extends URIS> {
  <A, B>(ff: Kind<URI, (a: A) => B>): (fa: Kind<URI, A>) => Kind<URI, B>
}
