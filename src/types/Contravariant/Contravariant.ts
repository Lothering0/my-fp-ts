import { URIS, URIS2 } from "../Kind"
import { Contramap, Contramap2, Contramap2C } from "./Contramap"

export interface Contravariant<URI extends URIS> {
  readonly URI: URI
  readonly contramap: Contramap<URI>
}

export interface Contravariant2<URI extends URIS2> {
  readonly URI: URI
  readonly contramap: Contramap2<URI>
}

export interface Contravariant2C<URI extends URIS2, E> {
  readonly URI: URI
  readonly _E: E
  readonly contramap: Contramap2C<URI, E>
}
