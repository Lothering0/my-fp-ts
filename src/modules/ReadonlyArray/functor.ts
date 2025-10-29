import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { ReadonlyArrayHkt } from './readonly-array'

export const Functor = Functor_.create<ReadonlyArrayHkt>({
  map: ab => self => self.map(a => ab(a)),
})

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
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

export const as: {
  <A>(a: A): (self: ReadonlyArray<unknown>) => ReadonlyArray<A>
} = FunctorWithIndex.as
