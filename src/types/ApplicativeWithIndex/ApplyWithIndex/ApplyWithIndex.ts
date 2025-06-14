import { Kind, URIS } from "../../Kind"

export interface ApplyWithIndex<URI extends URIS, I>
  extends ApplyWithIndexPointed<URI, I>,
    ApplyWithIndexPointFree<URI, I> {}

export interface ApplyWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: Kind<URI, A>, ff: Kind<URI, (i: I, a: A) => B>): Kind<URI, B>
}

export interface ApplyWithIndexPointFree<URI extends URIS, I> {
  <A, B>(ff: Kind<URI, (i: I, a: A) => B>): (fa: Kind<URI, A>) => Kind<URI, B>
}
