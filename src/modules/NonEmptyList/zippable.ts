import * as List from '../List'
import * as Zippable_ from '../../typeclasses/Zippable'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'

export const Zippable = {
  ...List.Zippable,
} as Zippable_.Zippable<NonEmptyListHkt>

export const zipWith: {
  <A, B, C>(
    bs: NonEmptyList<B>,
    abic: (a: A, b: B, i: number) => C,
  ): (list: NonEmptyList<A>) => NonEmptyList<C>
} = List.zipWith as typeof zipWith

export const zip: {
  <A, B>(
    bs: NonEmptyList<B>,
  ): (list: NonEmptyList<A>) => NonEmptyList<readonly [A, B]>
} = List.zip as typeof zip

export const unzip: {
  <A, B>(
    zipped: NonEmptyList<readonly [A, B]>,
  ): readonly [NonEmptyList<A>, NonEmptyList<B>]
} = List.unzip as typeof unzip
