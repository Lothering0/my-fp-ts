import * as functor from '../../typeclasses/Functor'
import * as functorWithIndex from '../../typeclasses/FunctorWithIndex'
import { ReadonlyArrayHkt } from './readonly-array'

export const Functor: functor.Functor<ReadonlyArrayHkt> = {
  map: ab => self => self.map(a => ab(a)),
}

export const FunctorWithIndex: functorWithIndex.FunctorWithIndex<
  ReadonlyArrayHkt,
  number
> = {
  ...Functor,
  mapWithIndex: aib => self => self.map((a, i) => aib(a, i)),
}

export const map: {
  <A, B>(
    aib: (a: A, i: number) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex
