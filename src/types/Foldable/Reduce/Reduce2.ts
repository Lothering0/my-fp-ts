import { URIS2, Kind2 } from "../../Kind"

export interface Reduce2<URI extends URIS2>
  extends Reduce2Pointed<URI>,
    Reduce2PointFree<URI> {}

export interface Reduce2Pointed<URI extends URIS2> {
  <E, A, B>(fa: Kind2<URI, E, A>, b: B, f: (b: B, a: A) => B): B
}

export interface Reduce2PointFree<URI extends URIS2> {
  <E, A, B>(b: B, f: (b: B, a: A) => B): (fa: Kind2<URI, E, A>) => B
}
