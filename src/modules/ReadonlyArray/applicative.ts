import * as Array from './readonly-array'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import { ReadonlyArrayHkt } from './readonly-array'
import { Monad, MonadWithIndex } from './monad'

export const Applicative = Applicative_.create<ReadonlyArrayHkt>(Monad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  ReadonlyArrayHkt,
  number
>(Applicative, MonadWithIndex)

export const apply: {
  <F extends ReadonlyArray<any>>(
    fa: F,
  ): <G extends ReadonlyArray<(a: Array.Infer<F>, i: number) => any>>(
    self: G,
  ) => Array.AndNonEmpty<F, G, ReturnType<Array.Infer<G>>>
} = ApplicativeWithIndex.applyWithIndex as any

export const flipApply: {
  <
    F extends ReadonlyArray<any>,
    G extends ReadonlyArray<(a: Array.Infer<F>, i: number) => any>,
  >(
    fab: G,
  ): (self: F) => Array.AndNonEmpty<F, G, ReturnType<Array.Infer<G>>>
} = ApplicativeWithIndex.flipApplyWithIndex as any
