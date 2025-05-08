import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

export interface FunctorWithIndex<URI extends URIS, I> extends Functor<URI> {
  readonly mapWithIndex: MapWithIndex<URI, I>
}

export interface FunctorWithIndex2<URI extends URIS2, I> extends Functor2<URI> {
  readonly mapWithIndex: MapWithIndex2<URI, I>
}

type CreateFunctorWithIndex = <URI extends URIS, I>(
  functorWithIndex: CreateFunctorWithIndexArg<URI, I>,
) => FunctorWithIndex<URI, I>
export const createFunctorWithIndex: CreateFunctorWithIndex = functor => ({
  ...functor,
  mapWithIndex: overloadWithPointFree (functor.mapWithIndex),
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
  readonly mapWithIndex: MapWithIndexPointed2<URI, I>
}

interface MapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, f: (i: I, a: A) => B): HKT<URI, B>
}

interface MapWithIndexPointed2<URI extends URIS2, I> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (i: I, a: A) => B): HKT2<URI, _, B>
}

interface MapWithIndex<URI extends URIS, I>
  extends MapWithIndexPointed<URI, I> {
  <A, B>(f: (i: I, a: A) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}

interface MapWithIndex2<URI extends URIS2, I>
  extends MapWithIndexPointed2<URI, I> {
  <_, A, B>(f: (i: I, a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
