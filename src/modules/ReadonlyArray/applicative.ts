import * as Array from './readonly-array'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import {
  Monad,
  MonadWithIndex,
  NonEmptyMonad,
  NonEmptyMonadWithIndex,
} from './monad'

export const Applicative = Applicative_.create<Array.Hkt>(Monad)

export const NonEmptyApplicative =
  Applicative_.create<Array.NonEmptyHkt>(NonEmptyMonad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  Array.Hkt,
  number
>(Applicative, MonadWithIndex)

export const NonEmptyApplicativeWithIndex = ApplicativeWithIndex_.create<
  Array.NonEmptyHkt,
  number
>(NonEmptyApplicative, NonEmptyMonadWithIndex)

export const apply: {
  <F extends ReadonlyArray<any>>(
    array: F,
  ): <G extends ReadonlyArray<(a: Array.Infer<F>, i: number) => any>>(
    selfArray: G,
  ) => Array.AndNonEmpty<F, G, ReturnType<Array.Infer<G>>>
} = ApplicativeWithIndex.applyWithIndex as any

export const flipApply: {
  <
    F extends ReadonlyArray<any>,
    G extends ReadonlyArray<(a: Array.Infer<F>, i: number) => any>,
  >(
    array: G,
  ): (selfArray: F) => Array.AndNonEmpty<F, G, ReturnType<Array.Infer<G>>>
} = ApplicativeWithIndex.flipApplyWithIndex as any
