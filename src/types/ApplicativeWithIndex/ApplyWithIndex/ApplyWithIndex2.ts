import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface ApplyWithIndex2<URI extends URIS2, I>
  extends ApplyWithIndex2Pointed<URI, I>,
    ApplyWithIndex2PointFree<URI, I> {}

export interface ApplyWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(
    fa: HKT2<URI, _, A>,
    ff: HKT2<URI, _, (i: I, a: A) => B>,
  ): HKT2<URI, _, B>
}

export interface ApplyWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(
    ff: HKT2<URI, _, (i: I, a: A) => B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
