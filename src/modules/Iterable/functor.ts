import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import * as Iterable from './iterable'

export const Functor = Functor_.create<Iterable.Hkt>({
  map: ab => iterable => ({
    *[Symbol.iterator]() {
      for (const a of iterable) {
        yield ab(a)
      }
    },
  }),
})

export const NonEmptyFunctor: Functor_.Functor<Iterable.NonEmptyHkt> =
  Functor as any

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Iterable.Hkt,
  number
> = {
  ...Functor,
  mapWithIndex: aib => iterable => ({
    *[Symbol.iterator]() {
      let i = -1
      for (const a of iterable) {
        i++
        yield aib(a, i)
      }
    },
  }),
}

export const NonEmptyFunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Iterable.NonEmptyHkt,
  number
> = FunctorWithIndex as any

export const map: {
  <F extends Iterable<any>, B>(
    aib: (a: Iterable.Infer<F>, i: number) => B,
  ): (iterable: F) => Iterable.With<F, B>
} = FunctorWithIndex.mapWithIndex as any

export const as: {
  <A>(a: A): <F extends Iterable<any>>(array: F) => Iterable.With<F, A>
} = FunctorWithIndex.as as any
