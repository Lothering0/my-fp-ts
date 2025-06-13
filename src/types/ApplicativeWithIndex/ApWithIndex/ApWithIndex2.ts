import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface ApWithIndex2<URI extends URIS2, I>
  extends ApWithIndex2Pointed<URI, I>,
    ApWithIndex2PointFree<URI, I> {}

export interface ApWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(
    ff: HKT2<URI, _, (i: I, a: A) => B>,
    fa: HKT2<URI, _, A>,
  ): HKT2<URI, _, B>
}

export interface ApWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(
    fa: HKT2<URI, _, A>,
  ): (ff: HKT2<URI, _, (i: I, a: A) => B>) => HKT2<URI, _, B>
}
