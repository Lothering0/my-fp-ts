import * as List from './list'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { reduceRight } from './foldable'

export const Functor = Functor_.create<List.Hkt>({
  map: ab => reduceRight(List.nil(), (a, list) => List.cons(ab(a), list)),
})

export const NonEmptyFunctor: Functor_.Functor<List.NonEmptyHkt> =
  Functor as any

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  List.Hkt,
  number
> = {
  ...Functor,
  mapWithIndex: aib =>
    reduceRight(List.nil(), (a, list, i) => List.cons(aib(a, i), list)),
}

export const NonEmptyFunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  List.NonEmptyHkt,
  number
> = FunctorWithIndex as any

export const map: {
  <F extends List.List<any>, B>(
    aib: (a: List.Infer<F>, i: number) => B,
  ): (list: F) => List.With<F, B>
} = FunctorWithIndex.mapWithIndex as any

export const as: {
  <A>(a: A): <F extends List.List<any>>(list: F) => List.With<F, A>
} = FunctorWithIndex.as as any
