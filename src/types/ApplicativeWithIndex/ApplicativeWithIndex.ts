import { URIS, URIS2 } from "../Kind"
import { Applicative, Applicative2, Applicative2C } from "../Applicative"
import { FlapWithIndex, FlapWithIndex2, FlapWithIndex2C } from "./FlapWithIndex"
import {
  FunctorWithIndex,
  FunctorWithIndex2,
  FunctorWithIndex2C,
} from "../FunctorWithIndex"
import { ApWithIndex, ApWithIndex2, ApWithIndex2C } from "./ApWithIndex"

export interface ApplicativeWithIndex<URI extends URIS, I>
  extends Applicative<URI>,
    FunctorWithIndex<URI, I> {
  readonly apWithIndex: ApWithIndex<URI, I>
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex<URI, I>["apWithIndex"]
  readonly flapWithIndex: FlapWithIndex<URI, I>
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex<URI, I>["flapWithIndex"]
}

export interface ApplicativeWithIndex2<URI extends URIS2, I>
  extends Applicative2<URI>,
    FunctorWithIndex2<URI, I> {
  readonly apWithIndex: ApWithIndex2<URI, I>
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex2<URI, I>["apWithIndex"]
  readonly flapWithIndex: FlapWithIndex2<URI, I>
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex2<URI, I>["flapWithIndex"]
}

export interface ApplicativeWithIndex2C<URI extends URIS2, I, E>
  extends Applicative2C<URI, E>,
    FunctorWithIndex2C<URI, I, E> {
  readonly apWithIndex: ApWithIndex2C<URI, I, E>
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex2C<URI, I, E>["apWithIndex"]
  readonly flapWithIndex: FlapWithIndex2C<URI, I, E>
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex2C<
    URI,
    I,
    E
  >["flapWithIndex"]
}
