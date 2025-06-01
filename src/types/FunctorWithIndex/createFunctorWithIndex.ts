import { Functor, Functor2 } from "../Functor"
import { URIS, URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { MapWithIndexPointed, MapWithIndex2Pointed } from "./MapWithIndex"
import { FunctorWithIndex, FunctorWithIndex2 } from "./FunctorWithIndex"

type CreateFunctorWithIndex = <URI extends URIS, I>(
  functorWithIndex: CreateFunctorWithIndexArg<URI, I>,
) => FunctorWithIndex<URI, I>
export const createFunctorWithIndex: CreateFunctorWithIndex = functor => ({
  ...functor,
  mapWithIndex: overload (functor.mapWithIndex),
})

type CreateFunctorWithIndex2 = <URI extends URIS2, I>(
  functorWithIndex: CreateFunctorWithIndexArg2<URI, I>,
) => FunctorWithIndex2<URI, I>
export const createFunctorWithIndex2: CreateFunctorWithIndex2 =
  createFunctorWithIndex as CreateFunctorWithIndex2

interface CreateFunctorWithIndexArg<URI extends URIS, I> extends Functor<URI> {
  readonly mapWithIndex: MapWithIndexPointed<URI, I>
}

interface CreateFunctorWithIndexArg2<URI extends URIS2, I>
  extends Functor2<URI> {
  readonly mapWithIndex: MapWithIndex2Pointed<URI, I>
}
