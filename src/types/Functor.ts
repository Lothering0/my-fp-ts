import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"

export interface Functor<URI extends URIS> {
  readonly _URI: URI
  readonly pure: <A>(a: A) => HKT<URI, A>
  readonly map: <A, B>(fa: HKT<URI, A>, f: (a: A) => B) => HKT<URI, B>
}

export interface Functor2<URI extends URIS2> {
  readonly _URI: URI
  readonly pure: <E, A>(a: A) => HKT2<URI, E, A>
  readonly map: <E, A, B>(
    fa: HKT2<URI, E, A>,
    f: (a: A) => B,
  ) => HKT2<URI, E, B>
}
