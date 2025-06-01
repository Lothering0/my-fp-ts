import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Apply<URI extends URIS>
  extends ApplyPointed<URI>,
    ApplyPointFree<URI> {}

export interface ApplyPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, ff: HKT<URI, (a: A) => B>): HKT<URI, B>
}

export interface ApplyPointFree<URI extends URIS> {
  <A, B>(ff: HKT<URI, (a: A) => B>): (fa: HKT<URI, A>) => HKT<URI, B>
}
