import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface ApWithIndex2C<URI extends URIS2, I, E>
  extends ApWithIndex2CPointed<URI, I, E>,
    ApWithIndex2CPointFree<URI, I, E> {}

export interface ApWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(
    ff: HKT2<URI, _, (i: I, a: A) => B>,
    fa: HKT2<URI, _, A>,
  ): HKT2<URI, _, B>
}

export interface ApWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(
    fa: HKT2<URI, _, A>,
  ): (ff: HKT2<URI, _, (i: I, a: A) => B>) => HKT2<URI, _, B>
}
