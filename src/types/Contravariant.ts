import { HKT } from "./HKT"
import { URIS } from "./Kind"

export interface Contravariant<URI extends URIS> {
  readonly _URI: URI
  readonly contramap: <A, B>(fa: HKT<URI, A>, f: (b: B) => A) => HKT<URI, B>
}
