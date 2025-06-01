import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Of2<URI extends URIS2> {
  <E = never, A = never>(a: A): HKT2<URI, E, A>
}
