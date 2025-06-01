import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Contramap<URI extends URIS>
  extends ContramapPointed<URI>,
    ContramapPointFree<URI> {}

export interface ContramapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, f: (b: B) => A): HKT<URI, B>
}

export interface ContramapPointFree<URI extends URIS> {
  <A, B>(f: (b: B) => A): (fa: HKT<URI, A>) => HKT<URI, B>
}
