import * as O from "../Option"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { flow } from "../../utils/flow"

export interface SomeConstructor2C<URI extends URIS2, E> {
  <A>(a: A): Kind2<URI, E, O.Option<A>>
}

export interface SomeConstructor2<URI extends URIS2> {
  <E, A>(a: A): Kind2<URI, E, O.Option<A>>
}

export interface SomeConstructor<URI extends URIS> {
  <A>(a: A): Kind<URI, O.Option<A>>
}

export function some<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): SomeConstructor2C<URI, E>
export function some<URI extends URIS2>(
  applicative: Applicative2<URI>,
): SomeConstructor2<URI>
export function some<URI extends URIS>(
  applicative: Applicative<URI>,
): SomeConstructor<URI>
export function some<URI extends URIS>(
  applicative: Applicative<URI>,
): SomeConstructor<URI> {
  return flow (O.some, applicative.of)
}
