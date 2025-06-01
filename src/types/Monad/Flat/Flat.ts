import { URIS } from "../../Kind"
import { HKT } from "../../HKT"

export interface Flat<URI extends URIS> {
  <A>(mma: HKT<URI, HKT<URI, A>>): HKT<URI, A>
}
