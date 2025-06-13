import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Contramap2<URI extends URIS2>
  extends Contramap2Pointed<URI>,
    Contramap2PointFree<URI> {}

export interface Contramap2Pointed<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (b: B) => A): HKT2<URI, _, B>
}

export interface Contramap2PointFree<URI extends URIS2> {
  <_, A, B>(f: (b: B) => A): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
