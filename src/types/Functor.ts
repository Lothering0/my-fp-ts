import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

export interface Functor<URI extends URIS> {
  readonly _URI: URI
  readonly of: <A>(a: A) => HKT<URI, A>
  readonly map: Map<URI>
}

export interface Functor2<URI extends URIS2> {
  readonly _URI: URI
  readonly of: <A>(a: A) => HKT2<URI, never, A>
  readonly map: Map2<URI>
}

type CreateFunctor = <URI extends URIS>(
  functor: CreateFunctorArg<URI>,
) => Functor<URI>
export const createFunctor: CreateFunctor = functor => ({
  ...functor,
  map: overloadWithPointFree (functor.map),
})

type CreateFunctor2 = <URI extends URIS2>(
  functor: CreateFunctorArg2<URI>,
) => Functor2<URI>
export const createFunctor2: CreateFunctor2 = createFunctor as CreateFunctor2

interface CreateFunctorArg<URI extends URIS> extends Omit<Functor<URI>, "map"> {
  readonly map: MapPointed<URI>
}

interface CreateFunctorArg2<URI extends URIS2>
  extends Omit<Functor2<URI>, "map"> {
  readonly map: MapPointed2<URI>
}

interface MapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, f: (a: A) => B): HKT<URI, B>
}

interface MapPointed2<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (a: A) => B): HKT2<URI, _, B>
}

interface Map<URI extends URIS> extends MapPointed<URI> {
  <A, B>(f: (a: A) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}

interface Map2<URI extends URIS2> extends MapPointed2<URI> {
  <_, A, B>(f: (a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
