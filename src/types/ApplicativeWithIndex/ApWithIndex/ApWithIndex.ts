import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface ApWithIndex<URI extends URIS, I>
  extends ApWithIndexPointed<URI, I>,
    ApWithIndexPointFree<URI, I> {}

export interface ApWithIndexPointed<URI extends URIS, I> {
  <A, B>(ff: HKT<URI, (i: I, a: A) => B>, fa: HKT<URI, A>): HKT<URI, B>
}

export interface ApWithIndexPointFree<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>): (ff: HKT<URI, (i: I, a: A) => B>) => HKT<URI, B>
}
