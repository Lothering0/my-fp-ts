import * as O from "../Option"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"

export function fromF<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): <A>(ma: Kind2<URI, E, A>) => Kind2<URI, E, O.Option<A>>
export function fromF<URI extends URIS2>(
  functor: Functor2<URI>,
): <E, A>(ma: Kind2<URI, E, A>) => Kind2<URI, E, O.Option<A>>
export function fromF<URI extends URIS>(
  functor: Functor<URI>,
): <A>(ma: Kind<URI, A>) => Kind<URI, O.Option<A>> {
  return functor.map (O.some)
}
