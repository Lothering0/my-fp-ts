import { URIS2, Kind2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApplyTo2<URI extends URIS2>
  extends ApplyTo2Pointed<URI>,
    ApplyTo2PointFree<URI> {}

export interface ApplyTo2Pointed<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: Kind2<URI, _, A>,
    name: Exclude<N, keyof A>,
    ff: Kind2<URI, _, (a: A) => B>,
  ): Kind2<URI, _, DoObject<N, A, B>>
}

export interface ApplyTo2PointFree<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    ff: Kind2<URI, _, (a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, DoObject<N, A, B>>
}
