import { URIS2 } from "../Kind"
import { Functor2, Functor2C } from "../Functor"
import { MapLeft, MapLeftC } from "./MapLeft"
import { Bimap, BimapC } from "./Bimap"

export interface Bifunctor<URI extends URIS2> extends Functor2<URI> {
  readonly mapLeft: MapLeft<URI>
  readonly bimap: Bimap<URI>
}

export interface BifunctorC<URI extends URIS2, E> extends Functor2C<URI, E> {
  readonly mapLeft: MapLeftC<URI, E>
  readonly bimap: BimapC<URI, E>
}
