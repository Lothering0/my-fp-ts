import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

interface MapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, f: (a: A, i: number) => B): HKT<URI, B>
}

interface Map<URI extends URIS> extends MapPointed<URI> {
  <A, B>(f: (a: A, i: number) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}

export interface FunctorWithIndex<URI extends URIS> extends Functor<URI> {
  readonly map: Map<URI>
}

type CreateFunctorWithIndex = <URI extends URIS>(
  functor: Omit<FunctorWithIndex<URI>, "map"> & {
    map: MapPointed<URI>
  },
) => FunctorWithIndex<URI>
export const createFunctorWithIndex: CreateFunctorWithIndex = functor => ({
  ...functor,
  map: overloadWithPointFree (functor.map),
})

interface MapPointed2<URI extends URIS2> {
  <E, A, B>(fa: HKT2<URI, E, A>, f: (a: A, i: number) => B): HKT2<URI, E, B>
}

interface Map2<URI extends URIS2> extends MapPointed2<URI> {
  <E, A, B>(f: (a: A, i: number) => B): (fa: HKT2<URI, E, A>) => HKT2<URI, E, B>
}

export interface FunctorWithIndex2<URI extends URIS2> extends Functor2<URI> {
  readonly _URI: URI
  readonly pure: <E, A>(a: A) => HKT2<URI, E, A>
  readonly map: Map2<URI>
}

type CreateFunctorWithIndex2 = <URI extends URIS2>(
  functorWithIndex: Omit<FunctorWithIndex2<URI>, "map"> & {
    map: MapPointed2<URI>
  },
) => Functor2<URI>
export const createFunctorWithIndex2: CreateFunctorWithIndex2 =
  createFunctorWithIndex as CreateFunctorWithIndex2
