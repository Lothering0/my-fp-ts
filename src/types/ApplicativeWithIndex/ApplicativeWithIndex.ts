import { URIS, URIS2 } from "../Kind"
import { Applicative, Applicative2, Applicative2C } from "../Applicative"
import {
  ApplyWithIndex,
  ApplyWithIndex2,
  ApplyWithIndex2C,
} from "./ApplyWithIndex"

export interface ApplicativeWithIndex<URI extends URIS, I>
  extends Applicative<URI> {
  readonly applyWithIndex: ApplyWithIndex<URI, I>
}

export interface ApplicativeWithIndex2<URI extends URIS2, I>
  extends Applicative2<URI> {
  readonly applyWithIndex: ApplyWithIndex2<URI, I>
}

export interface ApplicativeWithIndex2C<URI extends URIS2, I, E>
  extends Applicative2C<URI, E> {
  readonly applyWithIndex: ApplyWithIndex2C<URI, I, E>
}
