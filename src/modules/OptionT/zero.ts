import * as O from "../Option"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"

export function zero<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): <A>() => Kind2<URI, E, O.Option<A>>
export function zero<URI extends URIS2>(
  applicative: Applicative2<URI>,
): <E, A>() => Kind2<URI, E, O.Option<A>>
export function zero<URI extends URIS>(
  applicative: Applicative<URI>,
): <A>() => Kind<URI, O.Option<A>> {
  return () => applicative.of (O.none)
}
