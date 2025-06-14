import { Kind, URIS } from "../../Kind"

export interface Contramap<URI extends URIS>
  extends ContramapPointed<URI>,
    ContramapPointFree<URI> {}

export interface ContramapPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, f: (b: B) => A): Kind<URI, B>
}

export interface ContramapPointFree<URI extends URIS> {
  <A, B>(f: (b: B) => A): (fa: Kind<URI, A>) => Kind<URI, B>
}
