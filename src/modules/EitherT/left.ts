import * as E from "../Either"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { flow } from "../../utils/flow"

export interface Left2C<URI extends URIS2, KE> {
  <E, A = never>(e: E): Kind2<URI, KE, E.Either<E, A>>
}

export interface Left2<URI extends URIS2> {
  <KE, E, A = never>(e: E): Kind2<URI, KE, E.Either<E, A>>
}

export interface Left<URI extends URIS> {
  <E, A = never>(e: E): Kind<URI, E.Either<E, A>>
}

export function left<URI extends URIS2, KE>(
  applicative: Applicative2C<URI, KE>,
): Left2C<URI, KE>
export function left<URI extends URIS2>(
  applicative: Applicative2<URI>,
): Left2<URI>
export function left<URI extends URIS>(applicative: Applicative<URI>): Left<URI>
export function left<URI extends URIS>(
  applicative: Applicative<URI>,
): Left<URI> {
  return flow (E.left, applicative.of)
}

export interface LeftF2C<URI extends URIS2, KE> {
  <E, A = never>(fe: Kind2<URI, KE, E>): Kind2<URI, KE, E.Either<E, A>>
}

export interface LeftF2<URI extends URIS2> {
  <KE, E, A = never>(fe: Kind2<URI, KE, E>): Kind2<URI, KE, E.Either<E, A>>
}

export interface LeftF<URI extends URIS> {
  <E, A = never>(fe: Kind<URI, E>): Kind<URI, E.Either<E, A>>
}

export function leftF<URI extends URIS2, KE>(
  functor: Functor2C<URI, KE>,
): LeftF2C<URI, KE>
export function leftF<URI extends URIS2>(functor: Functor2<URI>): LeftF2<URI>
export function leftF<URI extends URIS>(functor: Functor<URI>): LeftF<URI>
export function leftF<URI extends URIS>(functor: Functor<URI>): LeftF<URI> {
  return functor.map (E.left)
}
