import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface FlatMap<URI extends URIS>
  extends FlatMapPointed<URI>,
    FlatMapPointFree<URI> {}

export interface FlatMapPointed<URI extends URIS> {
  <A, B>(ma: HKT<URI, A>, f: (a: A) => HKT<URI, B>): HKT<URI, B>
}

export interface FlatMapPointFree<URI extends URIS> {
  <A, B>(f: (a: A) => HKT<URI, B>): (ma: HKT<URI, A>) => HKT<URI, B>
}
