import { URIS, URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { MapPointed, Map2Pointed } from "./Map"
import { Functor, Functor2 } from "./Functor"

type CreateFunctor = <URI extends URIS>(
  functor: CreateFunctorArg<URI>,
) => Functor<URI>
export const createFunctor: CreateFunctor = functor => ({
  ...functor,
  map: overload (1, functor.map),
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
  readonly map: Map2Pointed<URI>
}
