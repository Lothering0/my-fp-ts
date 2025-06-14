import { Kind2 } from "../../Kind"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApS2C<URI extends URIS2, E>
  extends ApS2CPointed<URI, E>,
    ApS2CPointFree<URI, E> {}

export interface ApS2CPointed<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    fa: Kind2<URI, _, A>,
    name: Exclude<N, keyof A>,
    fb: Kind2<URI, _, B>
  ): Kind2<URI, _, DoObject<N, A, B>>
}

export interface ApS2CPointFree<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: Kind2<URI, _, B>
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, DoObject<N, A, B>>
}
