import * as O from "../Option"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { overload2 } from "../../utils/overloads"

interface Match2CPointed<URI extends URIS2, _> {
  <A, B>(
    ma: Kind2<URI, _, O.Option<A>>,
    onNone: () => B,
    onSome: (a: A) => B,
  ): Kind2<URI, _, B>
}

interface Match2Pointed<URI extends URIS2> {
  <_, A, B>(
    ma: Kind2<URI, _, O.Option<A>>,
    onNone: () => B,
    onSome: (a: A) => B,
  ): Kind2<URI, _, B>
}

interface MatchPointed<URI extends URIS> {
  <A, B>(
    ma: Kind<URI, O.Option<A>>,
    onNone: () => B,
    onSome: (a: A) => B,
  ): Kind<URI, B>
}

interface Match2CPointFree<URI extends URIS2, _> {
  <A, B>(
    onNone: () => B,
    onSome: (a: A) => B,
  ): (ma: Kind2<URI, _, O.Option<A>>) => Kind2<URI, _, B>
}

interface Match2PointFree<URI extends URIS2> {
  <_, A, B>(
    onNone: () => B,
    onSome: (a: A) => B,
  ): (ma: Kind2<URI, _, O.Option<A>>) => Kind2<URI, _, B>
}

interface MatchPointFree<URI extends URIS> {
  <A, B>(
    onNone: () => B,
    onSome: (a: A) => B,
  ): (ma: Kind<URI, O.Option<A>>) => Kind<URI, B>
}

export interface Match2C<URI extends URIS2, E>
  extends Match2CPointed<URI, E>,
    Match2CPointFree<URI, E> {}

export interface Match2<URI extends URIS2>
  extends Match2Pointed<URI>,
    Match2PointFree<URI> {}

export interface Match<URI extends URIS>
  extends MatchPointed<URI>,
    MatchPointFree<URI> {}

export function match<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Match2C<URI, E>
export function match<URI extends URIS2>(functor: Functor2<URI>): Match2<URI>
export function match<URI extends URIS>(functor: Functor<URI>): Match<URI>
export function match<URI extends URIS>(functor: Functor<URI>): Match<URI> {
  return overload2 ((mm, onNone, onSome) =>
    functor.map (mm, O.match (onNone, onSome)),
  )
}
