import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import * as List from './list'
import {
  Monad,
  MonadWithIndex,
  NonEmptyMonad,
  NonEmptyMonadWithIndex,
} from './monad'

export const Applicative = Applicative_.create<List.Hkt>(Monad)

export const NonEmptyApplicative =
  Applicative_.create<List.NonEmptyHkt>(NonEmptyMonad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  List.Hkt,
  number
>(Applicative, MonadWithIndex)

export const NonEmptyApplicativeWithIndex = ApplicativeWithIndex_.create<
  List.NonEmptyHkt,
  number
>(NonEmptyApplicative, NonEmptyMonadWithIndex)

export const apply: {
  <F extends List.List<any>>(
    fa: F,
  ): <G extends List.List<(a: List.Infer<F>, i: number) => any>>(
    list: G,
  ) => List.AndNonEmpty<F, G, ReturnType<List.Infer<G>>>
} = ApplicativeWithIndex.applyWithIndex as any

export const flipApply: {
  <
    F extends List.List<any>,
    G extends List.List<(a: List.Infer<F>, i: number) => any>,
  >(
    fab: G,
  ): (list: F) => List.AndNonEmpty<F, G, ReturnType<List.Infer<G>>>
} = ApplicativeWithIndex.flipApplyWithIndex as any
