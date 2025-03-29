import { HKT2 } from "./HKT"
import { URIS2 } from "./Kind"

export interface Bifunctor<URI extends URIS2> {
  readonly _URI: URI
  readonly mapLeft: <E, A, B>(
    fe: HKT2<URI, E, A>,
    f: (e: E) => B,
  ) => HKT2<URI, B, A>
  readonly bimap: <E, A, B = E, C = A>(
    fa: HKT2<URI, E, A>,
    f: (e: E) => B,
    g: (a: A) => C,
  ) => HKT2<URI, B, C>
}
