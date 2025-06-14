import { Kind, URIS } from "../../Kind"

export interface ApWithIndex<URI extends URIS, I>
  extends ApWithIndexPointed<URI, I>,
    ApWithIndexPointFree<URI, I> {}

export interface ApWithIndexPointed<URI extends URIS, I> {
  <A, B>(ff: Kind<URI, (i: I, a: A) => B>, fa: Kind<URI, A>): Kind<URI, B>
}

export interface ApWithIndexPointFree<URI extends URIS, I> {
  <A, B>(fa: Kind<URI, A>): (ff: Kind<URI, (i: I, a: A) => B>) => Kind<URI, B>
}
