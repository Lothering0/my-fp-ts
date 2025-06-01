import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface MapWithIndex<URI extends URIS, I>
  extends MapWithIndexPointed<URI, I>,
    MapWithIndexPointFree<URI, I> {}

export interface MapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, f: (i: I, a: A) => B): HKT<URI, B>
}

export interface MapWithIndexPointFree<URI extends URIS, I> {
  <A, B>(f: (i: I, a: A) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}
