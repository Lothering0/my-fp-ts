import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import { List, ListHkt } from './list'
import { Monad, MonadWithIndex } from './monad'

export const Applicative = Applicative_.create<ListHkt>(Monad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  ListHkt,
  number
>(Applicative, MonadWithIndex)

export const apply: {
  <A>(fa: List<A>): <B>(list: List<(a: A, i: number) => B>) => List<B>
} = ApplicativeWithIndex.applyWithIndex

export const flipApply: {
  <A, B>(fab: List<(a: A, i: number) => B>): (list: List<A>) => List<B>
} = ApplicativeWithIndex.flipApplyWithIndex
