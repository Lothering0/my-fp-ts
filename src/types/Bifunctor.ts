import { HKT2 } from "./HKT"
import { URIS2 } from "./Kind"
import { overloadWithPointFree, overloadWithPointFree2 } from "../utils/points"

export interface Bifunctor<URI extends URIS2> {
  readonly _URI: URI
  readonly mapLeft: MapLeft<URI>
  readonly bimap: Bimap<URI>
}

type CreateBifunctor = <URI extends URIS2>(
  bifunctor: CreateBifunctorArg<URI>,
) => Bifunctor<URI>
export const createBifunctor: CreateBifunctor = bifunctor => ({
  ...bifunctor,
  mapLeft: overloadWithPointFree (bifunctor.mapLeft),
  bimap: overloadWithPointFree2 (bifunctor.bimap),
})

interface CreateBifunctorArg<URI extends URIS2>
  extends Omit<Bifunctor<URI>, "mapLeft" | "bimap"> {
  readonly mapLeft: MapLeftPointed<URI>
  readonly bimap: BimapPointed<URI>
}

interface MapLeftPointed<URI extends URIS2> {
  <E, _, B>(fe: HKT2<URI, E, _>, f: (e: E) => B): HKT2<URI, B, _>
}

interface MapLeft<URI extends URIS2> extends MapLeftPointed<URI> {
  <E, _, B>(f: (e: E) => B): (fe: HKT2<URI, E, _>) => HKT2<URI, B, _>
}

interface BimapPointed<URI extends URIS2> {
  <E, A, B = E, C = A>(
    fa: HKT2<URI, E, A>,
    f: (e: E) => B,
    g: (a: A) => C,
  ): HKT2<URI, B, C>
}

interface Bimap<URI extends URIS2> extends BimapPointed<URI> {
  <E, A, B = E, C = A>(
    f: (e: E) => B,
    g: (a: A) => C,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, B, C>
}
