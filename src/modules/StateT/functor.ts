import { URIS, URIS2 } from "../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { overload } from "../../utils/overloads"
import { StateT, StateT2 } from "./StateT"

interface Map2CPointed<URI extends URIS2, _> {
  <S, A, B>(fma: StateT2<URI, _, S, A>, f: (a: A) => B): StateT2<URI, _, S, B>
}

interface Map2Pointed<URI extends URIS2> {
  <S, _, A, B>(
    fma: StateT2<URI, _, S, A>,
    f: (a: A) => B,
  ): StateT2<URI, _, S, B>
}

interface MapPointed<URI extends URIS> {
  <S, A, B>(fma: StateT<URI, S, A>, f: (a: A) => B): StateT<URI, S, B>
}

interface Map2CPointFree<URI extends URIS2, _> {
  <S, A, B>(
    f: (a: A) => B,
  ): (fma: StateT2<URI, _, S, A>) => StateT2<URI, _, S, B>
}

interface Map2PointFree<URI extends URIS2> {
  <S, _, A, B>(
    f: (a: A) => B,
  ): (fma: StateT2<URI, _, S, A>) => StateT2<URI, _, S, B>
}

interface MapPointFree<URI extends URIS> {
  <S, A, B>(f: (a: A) => B): (fma: StateT<URI, S, A>) => StateT<URI, S, B>
}

export interface Map2C<URI extends URIS2, E>
  extends Map2CPointed<URI, E>,
    Map2CPointFree<URI, E> {}

export interface Map2<URI extends URIS2>
  extends Map2Pointed<URI>,
    Map2PointFree<URI> {}

export interface Map<URI extends URIS>
  extends MapPointed<URI>,
    MapPointFree<URI> {}

export function map<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Map2C<URI, E>
export function map<URI extends URIS2>(functor: Functor2<URI>): Map2<URI>
export function map<URI extends URIS>(functor: Functor<URI>): Map<URI>
export function map<URI extends URIS>(functor: Functor<URI>): Map<URI> {
  const mapPointed: MapPointed<URI> = (fma, f) => s =>
    functor.map (fma (s), ([a, s]) => [f (a), s])

  return overload (mapPointed)
}
