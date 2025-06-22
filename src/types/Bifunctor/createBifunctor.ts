import { URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { Functor2 } from "../Functor"
import { Bifunctor } from "./Bifunctor"
import { BimapPointed } from "./Bimap"
import { MapLeftPointed } from "./MapLeft"

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
    mapLeft: overload (1, mapLeft),
    bimap: overload (2, bimapPointed),
  }
}

interface CreateBifunctorArg<URI extends URIS2>
  extends Functor2<URI>,
    Omit<Bifunctor<URI>, "mapLeft" | "bimap"> {
  readonly mapLeft: MapLeftPointed<URI>
}
