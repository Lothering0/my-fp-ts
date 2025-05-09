import { HKT2 } from "./HKT"
import { URIS2 } from "./Kind"
import { overloadWithPointFree, overloadWithPointFree2 } from "../utils/points"
import { Functor2 } from "./Functor"

export interface Bifunctor<URI extends URIS2> extends Functor2<URI> {
  readonly _URI: URI
  readonly mapLeft: MapLeft<URI>
  readonly bimap: Bimap<URI>
}

type CreateBifunctor = <URI extends URIS2>(
  bifunctor: CreateBifunctorArg<URI>,
) => Bifunctor<URI>
export const createBifunctor: CreateBifunctor = <URI extends URIS2>(
  bifunctor: CreateBifunctorArg<URI>,
) => {
  const { map, mapLeft } = bifunctor
  const bimapPointed: BimapPointed<URI> = (fa, f, g) => mapLeft (map (fa, g), f)

  return {
    ...bifunctor,
    mapLeft: overloadWithPointFree (mapLeft),
    bimap: overloadWithPointFree2 (bimapPointed),
  }
}

interface CreateBifunctorArg<URI extends URIS2>
  extends Functor2<URI>,
    Omit<Bifunctor<URI>, "mapLeft" | "bimap"> {
  readonly mapLeft: MapLeftPointed<URI>
}

interface MapLeftPointed<URI extends URIS2> {
  <E, _, D>(fe: HKT2<URI, E, _>, f: (e: E) => D): HKT2<URI, D, _>
}

interface MapLeft<URI extends URIS2> extends MapLeftPointed<URI> {
  <E, _, D>(f: (e: E) => D): (fe: HKT2<URI, E, _>) => HKT2<URI, D, _>
}

interface BimapPointed<URI extends URIS2> {
  <E, A, D = E, B = A>(
    fa: HKT2<URI, E, A>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): HKT2<URI, D, B>
}

interface Bimap<URI extends URIS2> extends BimapPointed<URI> {
  <E, A, D = E, B = A>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, D, B>
}
