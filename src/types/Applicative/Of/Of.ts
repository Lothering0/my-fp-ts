import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Of<URI extends URIS> {
  <A>(a: A): HKT<URI, A>
}
