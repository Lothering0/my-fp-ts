import { Functor, Functor2, Functor2C } from "../Functor"
import { URIS, URIS2 } from "../Kind"
import { MapWithIndex, MapWithIndex2, MapWithIndex2C } from "./MapWithIndex"

export interface FunctorWithIndex<URI extends URIS, I> extends Functor<URI> {
  readonly mapWithIndex: MapWithIndex<URI, I>
}

export interface FunctorWithIndex2<URI extends URIS2, I> extends Functor2<URI> {
  readonly mapWithIndex: MapWithIndex2<URI, I>
}

export interface FunctorWithIndex2C<URI extends URIS2, I, E>
  extends Functor2C<URI, E> {
  readonly mapWithIndex: MapWithIndex2C<URI, I, E>
}
