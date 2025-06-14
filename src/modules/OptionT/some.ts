import * as O from "../Option"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { flow } from "../../utils/flow"

export function some<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): <A>(a: A) => Kind2<URI, E, O.Option<A>>
export function some<URI extends URIS2>(
  applicative: Applicative2<URI>,
): <E, A>(a: A) => Kind2<URI, E, O.Option<A>>
export function some<URI extends URIS>(
  applicative: Applicative<URI>,
): <A>(a: A) => Kind<URI, O.Option<A>> {
  return flow (O.some, applicative.of)
}
