import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { pipe } from '../../utils/flow'
import { fromIterable } from './utils'

export const Functor = Functor_.create<Chunk.Hkt>({
  map: ab => chunk => pipe(chunk, Iterable.Functor.map(ab), fromIterable),
})

export const NonEmptyFunctor: Functor_.Functor<Chunk.NonEmptyHkt> =
  Functor as any

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Chunk.Hkt,
  number
> = {
  ...Functor,
  mapWithIndex: aib => chunk =>
    pipe(chunk, Iterable.FunctorWithIndex.mapWithIndex(aib), fromIterable),
}

export const NonEmptyFunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Chunk.NonEmptyHkt,
  number
> = FunctorWithIndex as any

export const map =
  <F extends Chunk.Chunk<any>, B>(aib: (a: Chunk.Infer<F>, i: number) => B) =>
  (chunk: F): Chunk.With<F, B> =>
    FunctorWithIndex.mapWithIndex(aib)(chunk) as any

export const as: {
  <A>(a: A): <F extends Chunk.Chunk<any>>(chunk: F) => Chunk.With<F, A>
} = FunctorWithIndex.as as any
