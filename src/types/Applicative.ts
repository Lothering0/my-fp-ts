import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"

export interface Applicative<URI extends URIS> {
  readonly _URI: URI
  readonly apply: <A, B>(
    fa: HKT<URI, A>,
    ff: HKT<URI, (a: A) => B>,
  ) => HKT<URI, B>
}

export interface Applicative2<URI extends URIS2> {
  readonly _URI: URI
  readonly apply: <E, A, B>(
    fa: HKT2<URI, E, A>,
    ff: HKT2<URI, E, (a: A) => B>,
  ) => HKT2<URI, E, B>
}
