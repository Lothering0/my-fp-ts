import { Kind, URIS } from "../../Kind"

export interface FlapWithIndex<URI extends URIS, I>
  extends FlapWithIndexPointed<URI, I>,
    FlapWithIndexPointFree<URI, I> {}

export interface FlapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: Kind<URI, A>, ff: Kind<URI, (i: I, a: A) => B>): Kind<URI, B>
}

export interface FlapWithIndexPointFree<URI extends URIS, I> {
  <A, B>(ff: Kind<URI, (i: I, a: A) => B>): (fa: Kind<URI, A>) => Kind<URI, B>
}
