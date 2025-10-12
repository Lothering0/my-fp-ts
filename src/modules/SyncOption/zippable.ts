import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { SyncOption } from './sync-option'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(
    that: SyncOption<B>,
    f: (a: A, b: B) => C,
  ): (self: SyncOption<A>) => SyncOption<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(
    that: SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(
    zipped: SyncOption<readonly [A, B]>,
  ): readonly [SyncOption<A>, SyncOption<B>]
} = Zippable.unzip
