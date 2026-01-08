import * as List from './list'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { reduceRight } from './foldable'

export const Functor = Functor_.create<List.ListHkt>({
  map: ab => reduceRight(List.nil(), (a, list) => List.cons(ab(a), list)),
})

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  List.ListHkt,
  number
> = {
  ...Functor,
  mapWithIndex: aib =>
    reduceRight(List.nil(), (a, list, i) => List.cons(aib(a, i), list)),
}

export const map: {
  <A, B>(aib: (a: A, i: number) => B): (list: List.List<A>) => List.List<B>
} = FunctorWithIndex.mapWithIndex

export const as: {
  <A>(a: A): (list: List.List<unknown>) => List.List<A>
} = FunctorWithIndex.as
