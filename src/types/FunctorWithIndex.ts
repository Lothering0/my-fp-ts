import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

interface MapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, f: (i: I, a: A) => B): HKT<URI, B>
}

interface MapWithIndex<URI extends URIS, I>
  extends MapWithIndexPointed<URI, I> {
  <A, B>(f: (i: I, a: A) => B): (fa: HKT<URI, A>) => HKT<URI, B>
}

export interface FunctorWithIndex<URI extends URIS, I> extends Functor<URI> {
  readonly mapWithIndex: MapWithIndex<URI, I>
}

type CreateFunctorWithIndex = <URI extends URIS, I>(
  functor: Functor<URI> & {
    mapWithIndex: MapWithIndexPointed<URI, I>
  },
) => FunctorWithIndex<URI, I>
export const createFunctorWithIndex: CreateFunctorWithIndex = functor => ({
  ...functor,
  mapWithIndex: overloadWithPointFree (functor.mapWithIndex),
})

interface MapWithIndexPointed2<URI extends URIS2, I> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (i: I, a: A) => B): HKT2<URI, _, B>
}

interface MapWithIndex2<URI extends URIS2, I>
  extends MapWithIndexPointed2<URI, I> {
  <_, A, B>(f: (i: I, a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}

export interface FunctorWithIndex2<URI extends URIS2, I> extends Functor2<URI> {
  readonly mapWithIndex: MapWithIndex2<URI, I>
}

type CreateFunctorWithIndex2 = <URI extends URIS2, I>(
  functorWithIndex: Functor2<URI> & {
    mapWithIndex: MapWithIndexPointed2<URI, I>
  },
) => FunctorWithIndex2<URI, I>
export const createFunctorWithIndex2: CreateFunctorWithIndex2 =
  createFunctorWithIndex as CreateFunctorWithIndex2
