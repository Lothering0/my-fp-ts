import { URIS, URIS2 } from "../Kind"
import { Of, Of2, Of2C } from "./Of"
import { Flap, Flap2, Flap2C } from "./Flap"
import { Functor, Functor2, Functor2C } from "../Functor"
import { Ap, Ap2, Ap2C } from "./Ap"

export interface Applicative<URI extends URIS> extends Functor<URI> {
  readonly of: Of<URI>
  readonly ap: Ap<URI>
  /** Alias for `ap` */
  readonly apply: Applicative<URI>["ap"]
  readonly flap: Flap<URI>
  /** Alias for `flap` */
  readonly flipApply: Applicative<URI>["flap"]
}

export interface Applicative2<URI extends URIS2> extends Functor2<URI> {
  readonly of: Of2<URI>
  readonly ap: Ap2<URI>
  /** Alias for `ap` */
  readonly apply: Applicative2<URI>["ap"]
  readonly flap: Flap2<URI>
  /** Alias for `flap` */
  readonly flipApply: Applicative2<URI>["flap"]
}

export interface Applicative2C<URI extends URIS2, E> extends Functor2C<URI, E> {
  readonly of: Of2C<URI, E>
  readonly ap: Ap2C<URI, E>
  /** Alias for `ap` */
  readonly apply: Applicative2C<URI, E>["ap"]
  readonly flap: Flap2C<URI, E>
  /** Alias for `flap` */
  readonly flipApply: Applicative2C<URI, E>["flap"]
}
