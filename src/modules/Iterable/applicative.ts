import * as Iterable from './iterable'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import {
  Monad,
  MonadWithIndex,
  NonEmptyMonad,
  NonEmptyMonadWithIndex,
} from './monad'

export const Applicative = Applicative_.create<Iterable.Hkt>(Monad)

export const NonEmptyApplicative =
  Applicative_.create<Iterable.NonEmptyHkt>(NonEmptyMonad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  Iterable.Hkt,
  number
>(Applicative, MonadWithIndex)

export const NonEmptyApplicativeWithIndex = ApplicativeWithIndex_.create<
  Iterable.NonEmptyHkt,
  number
>(NonEmptyApplicative, NonEmptyMonadWithIndex)

export const apply: {
  <F extends Iterable<any>>(
    fa: F,
  ): <G extends Iterable<(a: Iterable.Infer<F>, i: number) => any>>(
    self: G,
  ) => Iterable.AndNonEmpty<F, G, ReturnType<Iterable.Infer<G>>>
} = NonEmptyApplicativeWithIndex.applyWithIndex as any

export const flipApply: {
  <
    F extends Iterable<any>,
    G extends Iterable<(a: Iterable.Infer<F>, i: number) => any>,
  >(
    fab: G,
  ): (self: F) => Iterable.AndNonEmpty<F, G, ReturnType<Iterable.Infer<G>>>
} = NonEmptyApplicativeWithIndex.flipApplyWithIndex as any
