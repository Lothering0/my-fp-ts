import * as Array from './readonly-array'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'

export const Functor = Functor_.create<Array.ReadonlyArrayHkt>({
  map: ab => self => self.map(a => ab(a)),
})

export const map =
  <F extends ReadonlyArray<any>, B>(aib: (a: Array.Infer<F>, i: number) => B) =>
  (array: F): Array.With<F, B> =>
    array.map((a, i) => aib(a, i)) as unknown as Array.With<F, B>

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Array.ReadonlyArrayHkt,
  number
> = {
  ...Functor,
  mapWithIndex: map,
}

export const as: {
  <A>(a: A): <F extends ReadonlyArray<any>>(array: F) => Array.With<F, A>
} = FunctorWithIndex.as as any
