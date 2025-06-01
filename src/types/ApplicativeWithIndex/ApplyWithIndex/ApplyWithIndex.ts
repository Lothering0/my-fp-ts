import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface ApplyWithIndex<URI extends URIS, I>
  extends ApplyWithIndexPointed<URI, I>,
    ApplyWithIndexPointFree<URI, I> {}

export interface ApplyWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, ff: HKT<URI, (i: I, a: A) => B>): HKT<URI, B>
}

export interface ApplyWithIndexPointFree<URI extends URIS, I> {
  <A, B>(ff: HKT<URI, (i: I, a: A) => B>): (fa: HKT<URI, A>) => HKT<URI, B>
}
