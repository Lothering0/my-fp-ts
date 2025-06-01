import { URIS, URIS2 } from "../Kind"
import { Map, Map2, Map2C } from "./Map"

export interface Functor<URI extends URIS> {
  readonly _URI: URI
  readonly map: Map<URI>
}

export interface Functor2<URI extends URIS2> {
  readonly _URI: URI
  readonly map: Map2<URI>
}

export interface Functor2C<URI extends URIS2, E> {
  readonly _URI: URI
  readonly _E: E
  readonly map: Map2C<URI, E>
}
