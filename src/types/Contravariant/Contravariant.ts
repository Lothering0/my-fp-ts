import { URIS } from "../Kind"
import { Contramap } from "./Contramap"

export interface Contravariant<URI extends URIS> {
  readonly _URI: URI
  readonly contramap: Contramap<URI>
}
