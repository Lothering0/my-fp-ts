import { Extendable, Extendable2, Extendable2C } from "../Extendable"
import { URIS, URIS2 } from "../Kind"
import { Extract, Extract2, Extract2C } from "./Extract"

export interface Comonad<URI extends URIS> extends Extendable<URI> {
  readonly extract: Extract<URI>
}

export interface Comonad2<URI extends URIS2> extends Extendable2<URI> {
  readonly extract: Extract2<URI>
}

export interface Comonad2C<URI extends URIS2, E> extends Extendable2C<URI, E> {
  readonly extract: Extract2C<URI, E>
}
