import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

interface MapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, f: (a: A) => B): HKT<URI, B>
}

interface Map<URI extends URIS> extends MapPointed<URI> {
  <A, B>(f: (a: A) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}

export interface Functor<URI extends URIS> {
  readonly _URI: URI
  readonly pure: <A>(a: A) => HKT<URI, A>
  readonly map: Map<URI>
}

type CreateFunctor = <URI extends URIS>(
  functor: Omit<Functor<URI>, "map"> & { map: MapPointed<URI> },
) => Functor<URI>
export const createFunctor: CreateFunctor = functor => ({
  ...functor,
  map: overloadWithPointFree (functor.map),
})

interface MapPointed2<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (a: A) => B): HKT2<URI, _, B>
}

interface Map2<URI extends URIS2> extends MapPointed2<URI> {
  <_, A, B>(f: (a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}

export interface Functor2<URI extends URIS2> {
  readonly _URI: URI
  readonly pure: <_, A>(a: A) => HKT2<URI, _, A>
  readonly map: Map2<URI>
}

type CreateFunctor2 = <URI extends URIS2>(
  functor: Omit<Functor2<URI>, "map"> & { map: MapPointed2<URI> },
) => Functor2<URI>
export const createFunctor2: CreateFunctor2 = createFunctor as CreateFunctor2
