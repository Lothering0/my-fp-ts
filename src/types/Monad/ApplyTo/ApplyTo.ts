import { URIS, Kind } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApplyTo<URI extends URIS>
  extends ApplyToPointed<URI>,
    ApplyToPointFree<URI> {}

export interface ApplyToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: Kind<URI, A>,
    name: Exclude<N, keyof A>,
    ff: Kind<URI, (a: A) => B>,
  ): Kind<URI, DoObject<N, A, B>>
}

export interface ApplyToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ff: Kind<URI, (a: A) => B>,
  ): (fa: Kind<URI, A>) => Kind<URI, DoObject<N, A, B>>
}
