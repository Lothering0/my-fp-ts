import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { IterableHkt } from './iterable'

export const Functor: Functor_.Functor<IterableHkt> = {
  map: ab => self => ({
    *[Symbol.iterator]() {
      for (const a of self) {
        yield ab(a)
      }
    },
  }),
}

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  IterableHkt,
  number
> = {
  ...Functor,
  mapWithIndex: aib => self => ({
    *[Symbol.iterator]() {
      let i = -1
      for (const a of self) {
        i++
        yield aib(a, i)
      }
    },
  }),
}

export const map: {
  <A, B>(aib: (a: A, i: number) => B): (self: Iterable<A>) => Iterable<B>
} = FunctorWithIndex.mapWithIndex
