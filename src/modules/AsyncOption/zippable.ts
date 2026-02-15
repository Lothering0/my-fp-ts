import * as Zippable_ from '../../typeclasses/Zippable'
import { AsyncOption, Hkt } from './async-option'
import { _AsyncOption } from './_internal'

export const Zippable: Zippable_.Zippable<Hkt> = _AsyncOption.Zippable

export const zipWith: {
  <A, B, C>(
    asyncOption: AsyncOption<B>,
    f: (a: A, b: B) => C,
  ): (selfAsyncOption: AsyncOption<A>) => AsyncOption<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(
    asyncOption: AsyncOption<B>,
  ): (selfAsyncOption: AsyncOption<A>) => AsyncOption<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(
    zipped: AsyncOption<readonly [A, B]>,
  ): readonly [AsyncOption<A>, AsyncOption<B>]
} = Zippable.unzip
