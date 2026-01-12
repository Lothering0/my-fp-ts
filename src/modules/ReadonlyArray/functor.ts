import * as Array from './readonly-array'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'

export const Functor = Functor_.create<Array.Hkt>({
  map: ab => self => self.map(a => ab(a)),
})

export const NonEmptyFunctor: Functor_.Functor<Array.NonEmptyHkt> =
  Functor as any

export const map =
  <F extends ReadonlyArray<any>, B>(aib: (a: Array.Infer<F>, i: number) => B) =>
  (array: F): Array.With<F, B> =>
    array.map((a, i) => aib(a, i)) as any

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Array.Hkt,
  number
> = {
  ...Functor,
  mapWithIndex: map,
}

export const NonEmptyFunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Array.NonEmptyHkt,
  number
> = FunctorWithIndex as any

export const as: {
  <A>(a: A): <F extends ReadonlyArray<any>>(array: F) => Array.With<F, A>
} = FunctorWithIndex.as as any
