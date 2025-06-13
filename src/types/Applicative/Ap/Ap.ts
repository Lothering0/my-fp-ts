import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Ap<URI extends URIS>
  extends ApPointed<URI>,
    ApPointFree<URI> {}

export interface ApPointed<URI extends URIS> {
  <A, B>(ff: HKT<URI, (a: A) => B>, fa: HKT<URI, A>): HKT<URI, B>
}

export interface ApPointFree<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>): (ff: HKT<URI, (a: A) => B>) => HKT<URI, B>
}
