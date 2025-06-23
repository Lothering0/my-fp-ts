import { Kind, URIS } from "../../Kind"

export interface Flap<URI extends URIS>
  extends FlapPointed<URI>,
    FlapPointFree<URI> {}

export interface FlapPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, ff: Kind<URI, (a: A) => B>): Kind<URI, B>
}

export interface FlapPointFree<URI extends URIS> {
  <A, B>(ff: Kind<URI, (a: A) => B>): (fa: Kind<URI, A>) => Kind<URI, B>
}
