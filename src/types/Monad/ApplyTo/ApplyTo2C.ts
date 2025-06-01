import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApplyTo2C<URI extends URIS2, E>
  extends ApplyTo2CPointed<URI, E>,
    ApplyTo2CPointFree<URI, E> {}

export interface ApplyTo2CPointed<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, _, (a: A) => B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

export interface ApplyTo2CPointFree<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, _, (a: A) => B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}
