import * as O from "../Option"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { overload } from "../../utils/overloads"
import { Monad, Monad2, Monad2C } from "../../types/Monad"
import { pipe } from "../../utils/flow"
import { identity } from "../Identity"

interface FlatMap2CPointed<URI extends URIS2, _> {
  <A, B>(
    fma: Kind2<URI, _, O.Option<A>>,
    f: (a: A) => Kind2<URI, _, O.Option<B>>,
  ): Kind2<URI, _, O.Option<B>>
}

interface FlatMap2Pointed<URI extends URIS2> {
  <_, A, B>(
    fma: Kind2<URI, _, O.Option<A>>,
    f: (a: A) => Kind2<URI, _, O.Option<B>>,
  ): Kind2<URI, _, O.Option<B>>
}

interface FlatMapPointed<URI extends URIS> {
  <A, B>(
    fma: Kind<URI, O.Option<A>>,
    f: (a: A) => Kind<URI, O.Option<B>>,
  ): Kind<URI, O.Option<B>>
}

interface FlatMap2CPointFree<URI extends URIS2, _> {
  <A, B>(
    f: (a: A) => Kind2<URI, _, O.Option<B>>,
  ): (fma: Kind2<URI, _, O.Option<A>>) => Kind2<URI, _, O.Option<B>>
}

interface FlatMap2PointFree<URI extends URIS2> {
  <_, A, B>(
    f: (a: A) => Kind2<URI, _, O.Option<B>>,
  ): (fma: Kind2<URI, _, O.Option<A>>) => Kind2<URI, _, O.Option<B>>
}

interface FlatMapPointFree<URI extends URIS> {
  <A, B>(
    f: (a: A) => Kind<URI, O.Option<B>>,
  ): (fma: Kind<URI, O.Option<A>>) => Kind<URI, O.Option<B>>
}

export interface FlatMap2C<URI extends URIS2, E>
  extends FlatMap2CPointed<URI, E>,
    FlatMap2CPointFree<URI, E> {}

export interface FlatMap2<URI extends URIS2>
  extends FlatMap2Pointed<URI>,
    FlatMap2PointFree<URI> {}

export interface FlatMap<URI extends URIS>
  extends FlatMapPointed<URI>,
    FlatMapPointFree<URI> {}

export function flatMap<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): FlatMap2C<URI, E>
export function flatMap<URI extends URIS2>(monad: Monad2<URI>): FlatMap2<URI>
export function flatMap<URI extends URIS>(monad: Monad<URI>): FlatMap<URI>
export function flatMap<URI extends URIS>(monad: Monad<URI>): FlatMap<URI> {
  return overload (
    <A, B>(
      fma: Kind<URI, O.Option<A>>,
      f: (a: A) => Kind<URI, O.Option<B>>,
    ): Kind<URI, O.Option<B>> =>
      pipe (
        monad.Do,
        monad.apS ("ma", fma),
        monad.map (({ ma }) => O.map (ma, f)),
        monad.flatMap (O.match (() => monad.of (O.none), identity)),
      ),
  )
}
