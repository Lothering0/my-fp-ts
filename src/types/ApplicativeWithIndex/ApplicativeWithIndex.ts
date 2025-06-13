import { URIS, URIS2 } from "../Kind"
import { Applicative, Applicative2, Applicative2C } from "../Applicative"
import {
  ApplyWithIndex,
  ApplyWithIndex2,
  ApplyWithIndex2C,
} from "./ApplyWithIndex"
import {
  FunctorWithIndex,
  FunctorWithIndex2,
  FunctorWithIndex2C,
} from "../FunctorWithIndex"
import { ApWithIndex, ApWithIndex2, ApWithIndex2C } from "./ApWithIndex"

export interface ApplicativeWithIndex<URI extends URIS, I>
  extends Applicative<URI>,
    FunctorWithIndex<URI, I> {
  readonly applyWithIndex: ApplyWithIndex<URI, I>
  readonly apWithIndex: ApWithIndex<URI, I>
}

export interface ApplicativeWithIndex2<URI extends URIS2, I>
  extends Applicative2<URI>,
    FunctorWithIndex2<URI, I> {
  readonly applyWithIndex: ApplyWithIndex2<URI, I>
  readonly apWithIndex: ApWithIndex2<URI, I>
}

export interface ApplicativeWithIndex2C<URI extends URIS2, I, E>
  extends Applicative2C<URI, E>,
    FunctorWithIndex2C<URI, I, E> {
  readonly applyWithIndex: ApplyWithIndex2C<URI, I, E>
  readonly apWithIndex: ApWithIndex2C<URI, I, E>
}
